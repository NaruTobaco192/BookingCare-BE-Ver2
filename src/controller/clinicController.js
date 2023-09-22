import clinicService from "../services/clinicService"

let createClinic = async (req, res) => {
    try {
        let info = await clinicService.createClinic(req.body);
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
let getAllClinic = async (req, res) => {
    try {
        let info = await clinicService.getAllClinic();
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
let getDetailClinicById = async (req, res) => {
    try {
        let info = await clinicService.getDetailClinicById(req.query.id);
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
let postInfoClinic = async (req, res) => {
    try {
        let response = await clinicService.saveDetailInfoClinics(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
let handleDeleteClinic = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await clinicService.deleteClinic(req.body.id);
    return res.status(200).json(message);
}
let getClinicBySearch = async (req, res) => {
    try {
        let info = await clinicService.getClinicBySearch(req.query.search);
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
    createClinic, getAllClinic,
    getDetailClinicById, postInfoClinic,
    handleDeleteClinic, getClinicBySearch
}