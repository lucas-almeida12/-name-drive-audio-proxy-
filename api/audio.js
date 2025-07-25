const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send('Missing file id');
    return;
  }
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).send('Erro ao acessar o Google Drive');
    }

    // Permitir CORS para qualquer origem
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'audio/mpeg');
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Erro no proxy: ' + err.message);
  }
}; 
