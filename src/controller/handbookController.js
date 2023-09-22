import handbookService from "../services/handbookService"

let createHandBook = async (req, res) => {
    try {
        let info = await handbookService.createHandBook(req.body);
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
let getAllHandBook = async (req, res) => {
    try {
        let info = await handbookService.getAllHandBook();
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
let getDetailHandBookById = async (req, res) => {
    try {
        let info = await handbookService.getDetailHandBookById(req.query.id);
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
let postInfoHandbook = async (req, res) => {
    try {
        let response = await handbookService.saveDetailInfoHandbooks(req.body);
        return res.status(200).json(response);
    }
    catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the sever...'
        })
    }
}
let handleDeleteHandbook = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await handbookService.deleteHandbook(req.body.id);
    return res.status(200).json(message);
}
let getHandBookBySearch = async (req, res) => {
    try {
        let info = await handbookService.getHandBookBySearch(req.query.search);
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
    createHandBook, getAllHandBook,
    getDetailHandBookById, postInfoHandbook,
    handleDeleteHandbook, getHandBookBySearch
}