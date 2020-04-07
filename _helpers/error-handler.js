module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    
    if (typeof (err) === 'string') { // custom
        return res.status(400).json({ message: err });
    }

    if (err.message === 'ValidationError') { // mongoose validation
        return res.status(400).json({ message: err.message });
    }

    if (err.message === 'EmailAlreadyExists') { // email duplicado
        return res.status(409).json({ message: 'Email already exists' });
    }

    if (err.message === 'UnauthorizedCredentials') { // Fail auth
        return res.status(401).json({ message: 'Credentials invalid' });
    }

    if (err.name === 'UnauthorizedError') { // JWT auth
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.err(err.name);
    console.err(err.name);

    // default to 500 server error
    return res.status(500).json({ mensagem: err.message });
}