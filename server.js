//LEGGO IL FILE e LO FILTRO SECONDO IL SERVIZIO

//SERVIZI OBBLIGATORI DA ESPORRE (Sono per lo più contatori!)
  //1. Spese effettuate in generale e numero di prodotti comprati per ogni spesa
      
  //2. I prodotti comprati dall'utente 3 e quante volte in totale 

  //3. I prodotti comprati di più in totale

  //4. Indicare i negozi dove hanno acquistato e con quale frequenza

  //5. Indicare i negozi e quando si è speso di più

  //6. Indicare per ogni mese quanto si è speso

  //7. Salvataggio di una nuova spesa NEL FILE

let http = require("http");
let url = require("url");
let fs = require("fs");

var server = http.createServer(gestisciRichieste);
server.listen(1337);
console.log("Il server Ã¨ stato avviato !1337!");

function gestisciRichieste(richiesta, risposta){
    let indirizzo = richiesta.headers.host + richiesta.url;
    let info = url.parse(indirizzo, true);
    let risorsa = info.pathname;
    let file;
    let parola = "";
    switch(risorsa){
        case "/":
            file = fs.readFileSync("index.html");
            risposta.writeHead(200, {"Content-Type":"text/html"});
            risposta.write(file);
            risposta.end();
            break;
        case "/index.css":
            file = fs.readFileSync("index.css");
            risposta.writeHead(200, {"Content-Type":"text/css"});
            risposta.write(file);
            risposta.end();
            break;
        case "/index.js":
            file = fs.readFileSync("index.js");
            risposta.writeHead(200, {"Content-Type":"text/javascript"});
            risposta.write(file);
            risposta.end();
            break;
        case "/spesaGenerale":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                console.log(parola)

                let speses = {
                    data:[],
                    nProdotti:[]
                }

                file = JSON.parse(fs.readFileSync("dati.json"));

                for (let elemento in file){
                    speses.data.push(file[elemento].data)
                    speses.nProdotti.push(file[elemento].prodotti.length)
                }

                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(speses));
                risposta.end();
            });
            break;
        case "/ut3":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                let vet = []

                let speses = {
                    prodotto:[],
                    quantita:[]
                }

                file = JSON.parse(fs.readFileSync("dati.json"));

                for (let elemento in file){
                    if (file[elemento].ut == 3){
                        for (let acquisto in file[elemento].prodotti){
                            speses.prodotto.push(file[elemento].prodotti[acquisto].nome)
                            speses.quantita.push(file[elemento].prodotti[acquisto].qta)
                        }
                    }

                }

                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(speses));
                risposta.end();
            });

            break;
        case "/caricaProdotti":
            richiesta.on("data", (dato)=>{
                parola += dato;
            });

            richiesta.on("end", ()=>{
                let vet = []

                let speses = {
                    prodotto:[],
                    negoz:[]
                }

                file = JSON.parse(fs.readFileSync("dati.json"));

                for (let elemento in file){
                    speses.negoz.push(file[elemento].negozio)
                    for (let acquisto in file[elemento].prodotti){
                        speses.prodotto.push(file[elemento].prodotti[acquisto].nome)
                    }
                }
                console.log(speses)

                risposta.writeHead(200, {"Content-type":"text"});
                risposta.write(JSON.stringify(speses));
                risposta.end();
            });

            break;

        case "/inserisci":
            let objJ="";

            richiesta.on("data", (dato)=>{
                objJ += dato;
            });

            richiesta.on("end", ()=>{

                let s = JSON.parse(objJ);

                file = JSON.parse(fs.readFileSync("dati.json"));

                for(i in file)
                {
                    if(file[parseInt(i)+1]==undefined)
                    {
                        file[parseInt(i)+1]=s
                    }
                }


                fs.writeFile("dati.json", JSON.stringify(file), (err)=>{
                    if(err){
                        risposta.writeHead(500, {"Content-type":"application/json"});
                        let json = {desc:"Errore nel salvataggio"};
                        risposta.write(JSON.stringify(json));
                        risposta.end();
                    }else{
                        risposta.writeHead(200, {"Content-type":"application/json"});
                        let json = {desc:"Salvataggio avvenuto con successo"};
                        risposta.write(JSON.stringify(json));
                        risposta.end();
                    }
                });
            });
            break;
    }
}