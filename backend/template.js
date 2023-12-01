import { connection } from "../config/connectDb";
import jwt from "jsonwebtoken";

const refreshTokens = [];

// AccessToken
const generateAccessToken = (cid) => {
    console.log(typeof cid);
    const payload = {
        cid: cid,
    };
    return jwt.sign(payload, "access-secret-borrower", { expiresIn: "15h" });
    // return jwt.sign(cid, "access-secret-borrower", { expiresIn: "15s" });
};

// RefreshToken
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, "refresh-secret-borrower");
    refreshTokens.push(refreshToken);
    return refreshToken;
};

const signin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = SELECT * FROM users JOIN borrowers ON users.cid=borrowers.cid WHERE users.email='${email}' AND users.password=MD5('${password}');
    connection.query(sql, (err, result) => {
        if (err) return res.send(err);
        if (result.length === 0) {
            res.json({ err: "Tài khoản không tồn tại" });
        } else {
            const cid = result[0].cid;
            console.log(cid);
            const accessToken = generateAccessToken(cid);
            const refreshToken = generateRefreshToken(cid);
            res.json({
                accessToken,
                refreshToken,
                user: result[0],
            });
        }
    });
};

const forgotpassEmail = (req, res) => {
    const email = req.body.email;
    const sql = SELECT * FROM users WHERE email = '${email}';
    connection.query(sql, (err, result) => {
        if (err) return res.send(err);
        if (result.length === 0) {
            res.json({ err: "Tài khoản không tồn tại" });
        } else {
            res.json({
                cid: result[0].cid,
            });
        }
    });
};

const setNewPass = (req, res) => {
    const email = req.body.email;
    const password = req.body.newPass;
    const cid = req.body.cid;
    const sql = UPDATE users SET password = MD5('${password}'), email = '${email}' WHERE cid = '${cid}';
    connection.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

const changePass = (req, res) => {
    const email = req.body.email;
    const cid = req.body.cid;
    const newPass = req.body.newPass;
    const oldPass = req.body.oldPass;
    console.log(email, cid, newPass, oldPass);
    let sql = SELECT * FROM users WHERE password = MD5('${oldPass}') AND email = '${email}' AND cid = '${cid}';
    connection.query(sql, (err, result) => {
        if (err) {
            return res.send(err);
        }
        console.log(result);
        if (result.length === 0) {
            res.status(400).json({ err: "Mật khẩu không đúng" });
        } else {
            sql = UPDATE users SET password = MD5('${newPass}'), email = '${email}' WHERE cid = '${cid}';
            connection.query(sql, (err, result) => {
                if (err) return res.send(err);
                res.json(result);
            });
        }
    });
};

const setNewEmail = (req, res) => {
    const newEmail = req.body.newEmail;
    const cid = req.body.cid;

    let sql = UPDATE users SET email =  '${newEmail}' WHERE cid = '${cid}';
    connection.query(sql, (err, result) => {
        if (err) return res.send(err);

        sql = UPDATE borrowers SET email =  '${newEmail}' WHERE cid = '${cid}';
        connection.query(sql, (err, result) => {
            if (err) return res.send(err);
            res.json(result);
        });
    });
};

const getAvatar = (req, res) => {
    const cid = req.params.cid;
    console.log(cid);

    let sql = SELECT src_avatar FROM users WHERE cid = '${cid}';

    connection.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
};

const updateAvatar = (req, res) => {
    const email = req.body.email;
    console.log(req.file);
    if (!req.file) {
        console.log("No file upload");
    } else {
        // var imgsrc = "localhost:5000/images/" + req.file.filename;

        const src_avatar = "images/" + req.file.filename;

        // var insertData = "INSERT INTO users_file(file_src)VALUES(?)";
        // const sql  = "INSERT INTO users_file(file_src)VALUES(?)";
        const sql = UPDATE users SET src_avatar = '${src_avatar}'  WHERE email = '${email}';

        connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log("file uploaded");
            res.json({ src_avatar: src_avatar });
        });
    }
};

module.exports = {
    signin,
    forgotpassEmail,
    setNewPass,
    changePass,
    getAvatar,
    setNewEmail,
    updateAvatar,
};