import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();
const { Op } = require("sequelize");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create clinic succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll()
            if (clinics && clinics.length > 0) {
                clinics.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: clinics
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'image', 'name', 'address'],
                })
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId'],
                    })
                    data.doctorClinic = doctorClinic;
                } else {
                    data = {}
                }
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailClinicById succeed!',
                    data
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let saveDetailInfoClinics = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.address || !inputData.name || !inputData.image || !inputData.contentMarkdown
                || !inputData.contentHTML
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter!`
                })
            } else {
                //upsert
                if (inputData.action === 'CREATE') {
                    await db.Clinic.create({
                        descriptionHTML: inputData.contentHTML,
                        descriptionMarkdown: inputData.contentMarkdown,
                        name: inputData.name,
                        address: inputData.address,
                        image: inputData.image
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let editClinic = await db.Clinic.findOne({
                        where: { id: inputData.clinicId },
                        raw: false
                    })

                    if (editClinic) {
                        editClinic.descriptionHTML = inputData.contentHTML;
                        editClinic.descriptionMarkdown = inputData.contentMarkdown;
                        editClinic.name = inputData.name;
                        editClinic.address = inputData.address;
                        editClinic.image = inputData.image;
                        editClinic.updateAt = new Date();
                        await editClinic.save()
                    }
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Save info clinic succeed!'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let deleteClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        let foundClinic = await db.Clinic.findOne({
            where: { id: clinicId }
        })
        if (!foundClinic) {
            resolve({
                errCode: 2,
                errMessage: 'Clinic not exist!'
            })
        }

        await db.Clinic.destroy({
            where: { id: clinicId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete clinic succeed!'
        })
    })
}
let getClinicBySearch = (search) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinics = await db.Clinic.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            })
            if (clinics && clinics.length > 0) {
                clinics.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: clinics
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createClinic, getAllClinic,
    getDetailClinicById,
    saveDetailInfoClinics, deleteClinic,
    getClinicBySearch
}