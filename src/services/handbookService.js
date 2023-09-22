import db from '../models/index';
// import bcrypt from 'bcryptjs';
// require('dotenv').config();
const { Op } = require("sequelize");

let createHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML
                || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.HandBook.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create handbook succeed!'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbooks = await db.HandBook.findAll()
            if (handbooks && handbooks.length > 0) {
                handbooks.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: handbooks
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
let getDetailHandBookById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'name', 'image'],
                })
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    errMessage: 'Get getDetailHandBookById succeed!',
                    data
                })
            }

        }
        catch (e) {
            reject(e)
        }
    })
}
let saveDetailInfoHandbooks = (inputData) => {
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
                    await db.HandBook.create({
                        descriptionHTML: inputData.contentHTML,
                        descriptionMarkdown: inputData.contentMarkdown,
                        name: inputData.name,
                        image: inputData.image
                    })
                }
                else if (inputData.action === 'EDIT') {
                    let editHandbook = await db.HandBook.findOne({
                        where: { id: inputData.handbookId },
                        raw: false
                    })

                    if (editHandbook) {
                        editHandbook.descriptionHTML = inputData.contentHTML;
                        editHandbook.descriptionMarkdown = inputData.contentMarkdown;
                        editHandbook.name = inputData.name;
                        editHandbook.image = inputData.image;
                        editHandbook.updateAt = new Date();
                        await editHandbook.save()
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
let deleteHandbook = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        let foundHandbook = await db.HandBook.findOne({
            where: { id: specialtyId }
        })
        if (!foundHandbook) {
            resolve({
                errCode: 2,
                errMessage: 'Handbook not exist!'
            })
        }

        await db.HandBook.destroy({
            where: { id: specialtyId }
        })
        resolve({
            errCode: 0,
            errMessage: 'Delete handbook succeed!'
        })
    })
}
let getHandBookBySearch = (search) => {
    return new Promise(async (resolve, reject) => {
        try {
            let handbooks = await db.HandBook.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            })
            if (handbooks && handbooks.length > 0) {
                handbooks.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                data: handbooks
            })
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createHandBook, getAllHandBook,
    getDetailHandBookById, saveDetailInfoHandbooks,
    deleteHandbook, getHandBookBySearch
}