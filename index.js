const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const { WebhookClient } = require('dialogflow-fulfillment');

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://carlosjct:g8594rKaG8apWl58@cluster0.1aoqeux.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();
const database = client.db('chatbotEjemplo');
const panes = database.collection('pan');


app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post('/webhook', express.json(),  function (req, res) {
  const agent = new WebhookClient({ request: req, response: res });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

  
  async function PanSaladoTeleraIntent(agent) {
    const tipoPan = agent.parameters.tipoPan
    console.log(tipoPan);
    if (tipoPan.includes("telera") ) {
      const query = { nombre: 'Telera' };
      const pan = await panes.findOne(query);
      agent.add(pan.descripcion)
    } else if (tipoPan.includes("bolillo") ){
      const query = { nombre: 'Bolillo' };
      const pan = await panes.findOne(query);
      agent.add(pan.descripcion)
    }
  }

  var intentMap = new Map();
  intentMap.set('Pan Salado Telera Intent', PanSaladoTeleraIntent);
  agent.handleRequest(intentMap);
});

app.listen(3000, () => {
  console.log("Esta ejecutando el servidor en el puerto 3000");
}); 