const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    res.status(400).send('Missing file id');
    return;
  }
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  try {
    // Repasse o header Range se existir
    const headers = {};
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    const response = await fetch(url, { headers });

    if (!response.ok && response.status !== 206) {
      return res.status(response.status).send('Erro ao acessar o Google Drive');
    }

    // Repasse os headers relevantes
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Erro no proxy: ' + err.message);
  }
}; 
