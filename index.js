const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const { WebhookClient } = require('dialogflow-fulfillment');

const { MongoClient } = require("mongodb");

const uri = "
//obtener la URI de mongodb ATLAS y pegarla aqui
"
;
const client = new MongoClient(uri);
client.connect();
const database = client.db('chatbotEjemplo');
const informacion = database.collection('informacion');


app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post('/webhook', express.json(),  function (req, res) {

  const agent = new WebhookClient({ request: req, response: res });

  async function InformacionIntent(agent) {
    
    const tipo = agent.parameters.tipo
    if (tipo.includes("demencia") ) {
      const query = { nombre: 'Demencia' };
      const info = await informacion.findOne(query);
      agent.add(info.descripcion)
    } else if (tipo.includes("alzheimer") ){
      const query = { nombre: 'Alzheimer' };
      const info = await informacion.findOne(query);
      agent.add(info.descripcion)
    }
  }

  var intentMap = new Map();
  intentMap.set('Informacion Intent', InformacionIntent);
  agent.handleRequest(intentMap);
});

app.listen(3000, () => {
  console.log("Esta ejecutando el servidor en el puerto 3000");
}); 
