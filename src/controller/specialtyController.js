import specialtyService from "../services/specialtyService"

let createSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpecialty(req.body);
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllSpecialty();
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getDetailSpecialtyByIdLocation = async (req, res) => {
    try {
        let info = await specialtyService.getDetailSpecialtyByIdLocation(req.query.id, req.query.location);
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let getDetailSpecialtyById = async (req, res) => {
    try {
        let info = await specialtyService.getDetailSpecialtyById(req.query.id);
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
let postInfoSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.saveDetailInfoSpecialties(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
let handleDeleteSpecialty = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await specialtyService.deleteSpecialty(req.body.id);
    return res.status(200).json(message);
}
let getSpecialtyBySearch = async (req, res) => {
    try {
        let info = await specialtyService.getSpecialtyBySearch(req.query.search);
        return res.status(200).json(
            info
        )
    }
    catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever...'
        })
    }
}
module.exports = {
    createSpecialty, getAllSpecialty,
    getDetailSpecialtyByIdLocation, getDetailSpecialtyById,
    postInfoSpecialty, handleDeleteSpecialty, getSpecialtyBySearch
}