// Middleware para verificar rol
function requireRole(roles) {
	return (req, res, next) => {
		// El usuario debe estar autenticado y tener el rol adecuado
		// Aquí asumimos que el usuario está en req.user (debería venir de un middleware de autenticación/JWT)
		const user = req.user;
		if (!user) {
			return res.status(401).json({ mensaje: 'No autenticado' });
		}
		if (!roles.includes(user.rol)) {
			return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
		}
		next();
	};
}

const jwt = require('jsonwebtoken');

// Middleware para autenticar y poblar req.user
function authenticateJWT(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ mensaje: 'No autenticado' });
	}
	const token = authHeader.split(' ')[1];
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET || 'supersecreto');
		req.user = user;
		next();
	} catch (err) {
		return res.status(403).json({ mensaje: 'Token inválido o expirado' });
	}
}

module.exports = { requireRole, authenticateJWT };
