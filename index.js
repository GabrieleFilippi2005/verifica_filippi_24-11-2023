//POTETE AGGIUNGERE VARIABILI GLOBALI
let vetSpesa = {
    codSpesa:[],
    data:[],
    negozio:[],
    importo:[],
    prodotti: [],
    qta: []
}

//DA COMPLETARE (Connettersi al server chiedendo dei singoli servizi)
window.onload = ()=>{
    let addProduct = document.getElementById("aggiungProdotos")
    let aggiungi = document.getElementById("aggiungi")

    caricaProdotti()

    caricaSelect()

    utente3()

    addProduct.addEventListener("click",()=>{
        salvaProdotto()
    })

    aggiungi.addEventListener("click",()=>{
        salvaSpesa()
    })
}

async function caricaProdotti(){
    let select = document.getElementById("selProdotto")
    let selNegoz = document.getElementById("selNegozio")
    let selUt = document.getElementById("selUt")

    let busta = await fetch("http://localhost:1337/caricaProdotti",
        {
            "method":"POST"
        });
    let risposta = await busta.json();
    console.log(risposta.prodotto)

    for (let prodotto of risposta.prodotto){
        let li = document.createElement("option")
        li.innerHTML = prodotto
        select.appendChild(li)
    }

    for (let negozio of risposta.negoz){
        let li = document.createElement("option")
        li.innerHTML = negozio
        selNegoz.appendChild(li)
    }

    for (let i = 1; i < 10; i++){
        let li = document.createElement("option")
        li.innerHTML = i
        selUt.appendChild(li)
    }

}

//DA COMPLETARE 
async function caricaSelect(select, vet){

    let busta = await fetch("http://localhost:1337/spesaGenerale",
        {
            "method":"POST"
        });
    let risposta = await busta.json();
    console.log(risposta)
}

async function utente3() {
    let busta = await fetch("http://localhost:1337/ut3",
        {
            "method":"POST"
        });
    let risposta = await busta.json();
    console.log("ijdsci"+risposta)


    let arrayD=new Array();
    let arrayN=new Array();

    risposta.data.forEach(element => {
        arrayD.push(element)
    });

    risposta.nProdotti.forEach(element => {
        arrayN.push(element)
    });

    console.log(arrayD);
    console.log(arrayN);


    let myCanvas = document.getElementById("canvasUt0").getContext('2d');

    let chart = new Chart(myCanvas, {
        type: 'pie',
        data: {
            labels: arrayD,
            datasets: [{
                data: arrayN,
                borderWidth: 1,
                hoverBorderWidth: 3
            }],
            layout: {
                padding: 50
            }
        }
    });
}

//DA COMPLETARE e RICHIAMARE IN MODO OPPORTUNO
function salvaProdotto(){
    vetSpesa.prodotti.push(document.getElementById("selProdotto").value)
    vetSpesa.qta.push(document.getElementById("txtQta").value)
    console.log(vetSpesa)
}

//DA COMPLETARE e RICHIAMARE IN MODO OPPORTUNO
async function salvaSpesa(){
    vetSpesa.codSpesa = document.getElementById("selUt").value
    vetSpesa.data = document.getElementById("txtData").value
    vetSpesa.negozio = document.getElementById("selNegozio").value
    vetSpesa.importo = document.getElementById("txtImporto").value

    console.log(vetSpesa)

    let busta = await fetch("http://localhost:1337/inserisci",
        {
            "method":"POST",
            "headers":{"Content-Type":"application/json"},
            "body": JSON.stringify(vetSpesa)
        });
    let risposta = await busta.json();

    vetSpesa = {
        codSpesa:[],
        data:[],
        negozio:[],
        importo:[],
        prodotti: [],
        quantita: []
    }
    console.log(vetSpesa)
    console.log(risposta)
}

//POTETE INSERIRE ALTRE FUNZIONI


/**
 * Disegna il grafico basandosi sui parametri passati
 * @param {*} canvas Oggetto html canvas in cui inserire il grafico
 * @param {*} tipo Tipo di grafico da realizzare (line, pie, ...)
 * @param {*} data Dati da visualizzare [{desc:"", val:""}, ....] (POTETE MODIFICARLO!)
 * @param {*} label Nome del dato visualizzato (es. "Numero di prodotti acquistati")
 */
function disegnaGrafico(canvas, tipo, data, label){
  let dati = {
      labels: [],
      datasets: [{
        label: label,
        data: []
      }]
  };
  
  //DA QUI ------ POTETE MODIFICARLO
  for (let d of data) {
      dati.labels.push(d.desc);
      dati.datasets[0].data.push(parseInt(d.val));
  }
  //A QUI ------ POTETE MODIFICARLO

    Chart.defaults.color = '#FFF'; 
    let grafico = new Chart(canvas, {
        type: tipo,
        data: dati,
        options: {
            plugins: {
                legend: {
                    display: false
                },
            }
        }});
}