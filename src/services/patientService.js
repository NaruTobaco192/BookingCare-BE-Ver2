import db from '../models/index';
// import bcrypt from 'bcryptjs';
require('dotenv').config();
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid';

let buildLinkEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

    return result;
}
// let checkBooking = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let checkBook = await db.Booking.findOne({
//                 where: { patientId: data. }
//             })
//             if (user) {
//                 resolve(true);
//             }
//             else {
//                 resolve(false)
//             }
//         }
//         catch (e) {
//             reject(e);
//         }
//     })
// }
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.address || !data.selectedGender
                || !data.reason
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {

                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                //upsert patient
                // let user = await db.User.findOrCreate({
                //     where: { email: data.email },
                //     defaults: {
                //         email: data.email,
                //         roleId: 'R3',
                //         address: data.address,
                //         phonenumber: data.phoneNumber,
                //         gender: data.selectedGender,
                //         firstName: data.fullName
                //     },
                //     raw: false
                // })

                await db.User.create({
                    email: data.email,
                    roleId: 'R3',
                    address: data.address,
                    phonenumber: data.phoneNumber,
                    gender: data.selectedGender,
                    firstName: data.fullName
                })

                let user = await db.User.findAll({
                    where: { email: data.email },
                    order: [['createdAt', 'DESC']],
                })

                // let user = await db.User.findOne({
                //     where: { email: data.email },
                //     raw: false
                // })

                // if (user) {
                //     user.address = data.address;
                //     user.phonenumber = data.phoneNumber;
                //     user.gender = data.selectedGender;
                //     user.firstName = data.fullName;
                //     user.updateAt = new Date();
                //     await user.save()
                // } else {
                //     await db.User.create({
                //         email: data.email,
                //         roleId: 'R3',
                //         address: data.address,
                //         phonenumber: data.phoneNumber,
                //         gender: data.selectedGender,
                //         firstName: data.fullName
                //     })
                // }

                // user = await db.User.findOne({
                //     where: { email: data.email },
                //     raw: false
                // })

                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })

                    await emailService.sendEmail({
                        receiversEmail: data.email,
                        patientName: data.fullName,
                        time: data.timeString,
                        doctorName: data.doctorName,
                        language: data.language,
                        reason: data.reason,
                        redirectLink: buildLinkEmail(data.doctorId, token)
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'Save info patient succeed'
                    })
                }

                // if (user && user[0]) {
                //     await db.Booking.create({
                //         statusId: 'S1',
                //         doctorId: data.doctorId,
                //         patientId: user[0].id,
                //         date: data.date,
                //         timeType: data.timeType,
                //         token: token

                //     })
                // }

            }
        }
        catch (e) {
            reject(e)
        }
    })
}
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }
        }
        catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    postBookAppointment, postVerifyBookAppointment
}