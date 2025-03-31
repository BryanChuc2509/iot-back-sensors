import { where } from 'sequelize';
import Accounts from '../models/Accounts.js';
import Users from './../models/Users.js';
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy';
import qrCode from 'qrcode'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const {
    JWT_SECRET
} = process.env;

const register = async (req, res) => {

    try {

        const { nombre: name, contraseña: password = [], correo: email, rol: role } = req.body;

        const requiredFields = ['nombre', 'contraseña', 'correo'];

        for (const fieldRequired of requiredFields) {
            if (!req.body[fieldRequired]) {
                return res.status(400).send({
                    message: `El campo ${fieldRequired} es requerido`
                })
            }
            if (password.length < 8) return res.status(400).send({ msg: 'La contraseña debe tener al menos 8 caracteres' });
            if (!email.includes('@')) return res.status(400).send({ msg: 'El correo electrónico no es válido' });
        }

        const account = await Accounts.findOne({
            where: {
                id: 1
            }
        })

        console.log('La cuentas es', account.id)

        // if (!account) return res.status(400).send({ msg: 'No se encontró la cuenta' });

        const user = await Users.findOne({
            where: {
                email: email
            }
        })

        if (user) return res.status(400).send({ msg: 'El correo electrónico ya está en uso' });

        const hashPassword = await bcrypt.hash(password, 10);

        console.log('El usuario es', user);
        console.log('La contraseña sin hash es', password);
        console.log('La contraseña con hash es', hashPassword);


        const userCreated = await account.createUser({
            name: name,
            password: hashPassword,
            email: email,
            role: role === 'admin' ? 'Admin' : 'User'
        })
        return res.send({
            msg: 'Usuario registrado correctamente',
            data: userCreated
        })

    } catch (error) {

        return res.status(500).send({
            msg: 'Error al registrar el usuario',
            error: error.message
        });

    }
}

const login = async (req, res) => {
    try {
        const { correo: email, contraseña: password } = req.body;
        const requiredFields = ['correo', 'contraseña'];

        for (const fieldRequired of requiredFields) {
            if (!req.body[fieldRequired]) {
                return res.status(400).send({ msg: `El campo ${fieldRequired} es requerido` });
            }
        }
        if (!email.includes('@')) return res.status(400).send({ msg: 'El correo electrónico no es válido' });

        const user = await Users.findOne({ where: { email } });
        if (!user) return res.status(400).send({ msg: 'El usuario no existe' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).send({ msg: 'La contraseña es incorrecta' });

        if (!user.otp) {
            // Generar un secreto si el usuario no tiene OTP
            const secret = speakeasy.generateSecret({ length: 20 });

            user.otp = secret.base32;
            await user.save();

            const otpAuthUrl = secret.otpauth_url;
            const qrcode = await qrCode.toDataURL(otpAuthUrl);

            return res.send({
                msg: 'Escanea el código QR para habilitar 2FA',
                qrcode,
                hasOtp: false,
                userId: user.id,
            });
        }

        return res.send({
            msg: 'Ingresa tu código OTP para continuar',
            hasOtp: true,
            userId: user.id,
        });

    } catch (error) {
        return res.status(500).send({ msg: 'Error al iniciar sesión', error: error.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { otp, userId } = req.body;
        const user = await Users.findByPk(userId);

        if (!user) return res.status(400).send({ msg: 'Usuario no encontrado' });

        const isValid = speakeasy.totp.verify({
            secret: user.otp,
            encoding: 'base32',
            token: otp,
        });

        if (!isValid) return res.status(400).send({ msg: 'El código OTP es incorrecto' });

        // Generar token después de verificar OTP
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        try {
            res.cookie("token", token, {
                // httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 1000, // 1 hora
                // sameSite: 'Strict',
                credentials: true,
                secure : false
            });
        } catch (error) {
            return res.status(401).send({ msg: 'Error al verificar OTP', error: error.message });
        }

        return res.send({
            msg: 'OTP verificado correctamente',
            token,
        });

    } catch (error) {
        return res.status(401).send({ msg: 'Error al verificar OTP', error: error.message });
    }
};

export {
    register,
    login, 
    verifyOtp
}