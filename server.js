const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

mongoose.connect(
  'mongodb+srv://admin:HXfk6IfF0pqhTJFM@projeto-web.ewpo8.mongodb.net/projeto-web-db?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const Usuario = mongoose.model(
  'usuarios',
  new mongoose.Schema({
    _id: { type: String, default: shortid.generate },
    email: String,
    senha: String,
  })
);

app.post('/api/usuarios/login', async (req, res) => {
  const exists = await Usuario.exists({
    email: req.body.email,
    senha: req.body.senha,
  });
  if (exists) {
    const usuario = await Usuario.find({
      email: req.body.email,
      senha: req.body.senha,
    });
    return res.send(usuario);
  } else {
    return res.send({ message: 'INCORRETO' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  const exists = await Usuario.exists({ email: req.body.email });
  if (!exists) {
    const novoUsuario = new Usuario(req.body);
    const usuarioSalvo = await novoUsuario.save();
    res.send(usuarioSalvo);
  } else {
    return res.send({ message: 'CADASTRADO' });
  }
});

app.delete('/api/usuarios/:id', async (req, res) => {
  const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
  res.send(usuarioDeletado);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Server em http://localhost:5000'));
