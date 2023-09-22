import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();
const { Op } = require("sequelize");
let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create specialty succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                // attributes: {
                //     exclude: ['descriptionHTML', 'descriptionMarkdown']
                // },
            })
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: specialties
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyByIdLocation = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        //find-by-location
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],

                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailSpecialtyById succeed!',
                    data
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailSpecialtyById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'image', 'name'],
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailSpecialtyById succeed!',
                    data
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let saveDetailInfoSpecialties = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name || !inputData.image || !inputData.contentMarkdown
                || !inputData.contentHTML
            ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter!`
                })
            } else {
                //upsert
                if (inputData.action === 'CREATE') {
                    await db.Specialty.create({
                        descriptionHTML: inputData.contentHTML,
                        descriptionMarkdown: inputData.contentMarkdown,
                        name: inputData.name,
                        image: inputData.image
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let editSpecialty = await db.Specialty.findOne({
                        where: { id: inputData.specialtyId },
                        raw: false
                    })

                    if (editSpecialty) {
                        editSpecialty.descriptionHTML = inputData.contentHTML;
                        editSpecialty.descriptionMarkdown = inputData.contentMarkdown;
                        editSpecialty.name = inputData.name;
                        editSpecialty.image = inputData.image;
                        editSpecialty.updateAt = new Date();
                        await editSpecialty.save()
                    }
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Save info specialty succeed!'
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let deleteSpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        let foundSpecialty = await db.Specialty.findOne({
            where: { id: specialtyId }
        })
        if (!foundSpecialty) {
            resolve({
                errCode: 2,
                errMessage: 'Specialty not exist!'
            })
        }

        await db.Specialty.destroy({
            where: { id: specialtyId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete specialty succeed!'
        })
    })
}
let getSpecialtyBySearch = (search) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            })
            if (specialties && specialties.length > 0) {
                specialties.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: specialties
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createSpecialty, getAllSpecialty,
    getDetailSpecialtyByIdLocation, getDetailSpecialtyById,
    saveDetailInfoSpecialties, deleteSpecialty,
    getSpecialtyBySearch
}