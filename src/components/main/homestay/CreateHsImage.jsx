import React, {Component, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from "axios";
import { stringify } from "querystring";
import { ToastContainer, toast } from 'react-toastify';
import {homestayService} from '../../../services/homestay.service'
import {useDropzone} from 'react-dropzone'


const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};
  
const CreateHsImage = () => {
    const [isValidateError, setValidateError] = useState(false)
    const history = useHistory();

    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });
 
    const upload = () => {
        let createHs = JSON.parse(localStorage.getItem('create-homestay'));

        let formData = new FormData();
    
        files.map(file => {
            formData.append('file[]', file)            
        })
        formData.append('homestay_id', createHs.id)            

        homestayService.storeImage(formData).then((response) => {
            toast.success("Lưu thành công");
            setValidateError(false);
        })
    }
  
    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
        <div style={thumbInner}>
            <img
            src={file.preview}
            style={img}
            />
        </div>
    </div>
    ));

    useEffect(() => {
        if (!localStorage.getItem('create-homestay')) {
            history.push("/home/homestay/create/1");
        }

        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files])

    return (
        <div className="creatHsUtility">
            <h4>Cài đặt Ảnh</h4>
            
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
            <button onClick={upload} className="addHomestay mt-3">Thêm</button>

        </div>
    );
  };
   
export default CreateHsImage;