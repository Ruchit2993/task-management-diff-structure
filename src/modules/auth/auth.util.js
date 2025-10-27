import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};



export { generateToken, hashPassword, comparePassword };
