

var createError = require('http-errors');
var express = require('express');
var router = express.Router();

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');
const { default: Swal } = require('sweetalert2');
const { rootCertificates } = require('tls');
const { syncBuiltinESMExports } = require('module');


/* La rotta /users è vietata */
router.get('/', function(req, res, next) {
    
    next(createError(403));
});

/* Registrazione Utente */
router.post('/utenteregistrato', registrazione);

/* Login Utente */
router.post('/login', autenticazione);

router.post('/done', reg_amm);

router.post('/AggiungiMezzo', AggiungiMezzo);

router.get('/eliminautente', eliminautente);

router.post('/modificadati', modificadati);

router.post('/mezzoform', modificamezzoform);

router.post('/Noleggio', noleggioMezzo);

router.post('/NoleggioPT2', NoleggioPT2);

router.post('/NoleggioPT5', NoleggioPT5);

router.post('/NoleggioFine', NoleggioFine);

router.get('/mieiNoleggi', mieiNoleggi);

router.post('/mioNoleggio', mioNoleggio);

router.post('/ultimaModifica', ultimaModifica);

router.get('/elencomezziParcheggio', elencomezziParcheggio);

router.post('/modificadatiParcheggio', modificadatiParcheggio);

router.get('/datiparcheggio', datiparcheggio);

router.post('/AggiungiParcheggio', AggiungiParcheggio);

router.post('/trovaIncarichi', trovaIncarichi)

router.post('/accettaIncarico', accettaIncarico)

router.post('/consegnato', consegnato);

router.post('/ricercaMezzo', ricercaMezzo);

router.post('/modificaMezzo', modificaMezzo);
 
router.post('/cancellaMezzo', cancellaMezzo);

router.get('/ricercaParcheggio', ricercaParcheggio);

router.post('/ricercaParcheggio', ricercaParcheggio);

router.post('/cancellaParcheggio', cancellaParcheggio);

router.post('/SegnalaGuasto', SegnalaGuasto);

router.get('/mieiIncarichi', mieiIncarichi);

router.post('/cercaUtenze', cercaUtenze);

router.post('/cercaNoleggio', cercaNoleggi);

router.post('/cancellaNoleggio', cancellaNoleggio);

router.get('/email', email);

router.post('/RecuperoPassword', recuperoPassword);

router.post('/ReimpostaPassword', ReimpostaPassword);



async function modificamezzoform(req, res, next) {
    const db = await makeDb(config);
    let results = {};
       if(req.session.utente.ID_utente){
      results = await db.query('DELETE FROM `utente` WHERE ID_utente = ?',
  [
              req.session.utente.ID_utente
          ])
          .catch(err => {
              throw err;
            });
            req.session.destroy();
            res.redirect('/');
    }
  }
//da cambiare 



// da aggiustare 
async function eliminautente(req, res, next) {

    
    const db = await makeDb(config);
    if (req.session.utente.tipo_utente == 'Utente'){
    let results = {};
       if(req.session.utente.ID_utente){
      results = await db.query('DELETE FROM `utente` WHERE ID_utente = ?',
  [
              req.session.utente.ID_utente
          ])
          .catch(err => {
              throw err;
            });
            req.session.destroy();
            res.redirect('/');
    }
}
else{

    let results = {};
    if(req.session.utente.ID_utente){
   results = await db.query('DELETE FROM `utente` WHERE ID_utente = ?',
[
           utente.ID_utente
       ])
       .catch(err => {
           throw err;
         });
      
         res.redirect('/');
 }
}



}
  
// da aggiustare 



// middleware di registrazione 
async function registrazione(req, res, next) {
    const db = await makeDb(config); 
    let results = {};
    results = await db.query('SELECT * FROM `utente`\
            WHERE email = (?)', [
                    req.body.email
                ])
                .catch(err => {
                    throw err;
                });
                console.log(results.length);
            if (results.length != 0) {
                console.log('Utente già registarto');
                next(createError(404, 'Utente già registarto'));}
    
          else{
     
// inserimento utente
    try {
        await withTransaction(db, async() => { 

            // generazione della password cifrata con SHA512
            results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass]) //prende la password e applica la codifica sha2
                .catch(err => {
                    throw err;
                });



            let encpwd = results[0].encpwd;
            let utente_type = "Utente";
            console.log('Password cifrata');
            console.log(results);
            results = await db.query('INSERT INTO `utente` (tipo_utente,nome,cognome,data_nascita,telefono,cf,patente,regione,provincia,comune,carta,mese,cvv,email,password)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
                    utente_type,
                    req.body.name,
                    req.body.firstname,
                    req.body.Data_di_Nascita,
                    req.body.phone,
                    req.body.cf,
                    req.body.patente,
                    req.body.region,
                    req.body.state,
                    req.body.town,
                    req.body.carta,
                    req.body.mese,
                    req.body.cvv,
                    req.body.email,
                    encpwd
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`Utente ${req.body.email} inserito!`);
           

            notifica = {
                counter : 0,
                string : 'registrazione effettuata'
            };

                res.redirect('/accedi');
                
              

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
}

async function modificadati(req, res, next) {
    const db = await makeDb(config); 
    let results = {};

    if(req.session.utente.tipo_utente == 'Utente'){
    results = await db.query('SELECT * FROM `utente`\
            WHERE email = ? \
            EXCEPT \
            SELECT * FROM `utente`\
            WHERE ID_utente =? ', [
                    req.body.email,
                    req.session.utente.ID_utente
                ])
                .catch(err => {
                    throw err;
                });
                console.log(results.length);
            if (results.length != 0) {
                console.log('Email già in uso');
                next(createError(404, 'Email già in uso'));}
    
          else{
     
// inserimento utente
    try {
        await withTransaction(db, async() => { 

            // generazione della password cifrata con SHA512
            results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass]) //prende la password e applica la codifica sha2
                .catch(err => {
                    throw err;
                });

            let encpwd = results[0].encpwd;
            console.log('Password cifrata');
            console.log(results);
            if(req.session.utente){
                results = await db.query('UPDATE utente SET nome = ?,cognome = ?, telefono = ?, cf = ?, patente = ?,  carta = ?, mese = ?, cvv = ?, email= ?, password = ? WHERE ID_utente = ?',
                [
                         
                   
                    req.body.name,
                    req.body.firstname,
                    req.body.phone,
                    req.body.cf,
                    req.body.patente,
                    req.body.carta,
                    req.body.mese,
                    req.body.cvv,
                    req.body.email,
                    encpwd,
                    req.session.utente.ID_utente
                
            ])
                .catch(err => {
                    throw err;
                });
                req.session.utente.nome  = req.body.name,
               req.session.utente.cognome  = req.body.firstname,
               req.session.utente.telefono = req.body.phone,
               req.session.utente.cf = req.body.cf,
               req.session.utente.carta = req.body.carta,
               req.session.utente.mese = req.body.mese,
               req.session.utente.cvv = req.body.cvv,
               req.session.utente.email = req.body.email,
               res.redirect('/');
            }
            else{
              res.redirect('/accedi');
            } 
            
        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
}

else{
    results = await db.query('SELECT * FROM `utente`\
    WHERE email = ? \
    EXCEPT \
    SELECT * FROM `utente`\
    WHERE ID_utente =? ', [
            req.body.email,
            req.session.utente.ID_utente
        ])
        .catch(err => {
            throw err;
        });
        console.log(results.length);
    if (results.length != 0) {
        console.log('Email già in uso');
        next(createError(404, 'Email già in uso'));}

  else{

// inserimento utente
try {
await withTransaction(db, async() => { 

    // generazione della password cifrata con SHA512
    results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass]) //prende la password e applica la codifica sha2
        .catch(err => {
            throw err;
        });

    let encpwd = results[0].encpwd;
    console.log('Password cifrata');
    console.log(results);
    if(req.session.utente){
        results = await db.query('UPDATE utente SET nome = ?,cognome = ?, telefono = ?, cf = ?, patente = ?,  email= ?, password = ? WHERE ID_utente = ?',
        [
                 
           
            req.body.name,
            req.body.firstname,
            req.body.phone,
            req.body.cf,
            req.body.patente,
            req.body.email,
            encpwd,
            utente.ID_utente
        
    ])
        .catch(err => {
            throw err;
        });
        utente.nome  = req.body.name,
      utente.cognome  = req.body.firstname,
      utente.telefono = req.body.phone,
       utente.cf = req.body.cf,
       utente.patente = req.body.patente
       utente.email = req.body.email
       res.redirect('/datiUtenteC');
    }
    
});
} catch (err) {
var message =  'errore di sistema';
next(createError(message));
}
}
}
}


// middleware di autenticazione
async function autenticazione(req, res, next) {
    const db = await makeDb(config);
    let results = {};
   
    try {


        error = {
            myError : ''
        };
        await withTransaction(db, async() => {
            // inserimento utente
            results = await db.query('SELECT * FROM `utente`\
            WHERE email = (?)', [
                    req.body.email
                ])
                .catch(err => {
                    throw err;
                });
            if (results.length == 0) {
                error = {
                    myError : 'UNT'
                };
                console.log('Utente non trovato!');
               res.redirect('/accedi');
            } else {
               let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
                pwdhash.update(req.body.pass); // cifriamo la password
                let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale
                console.log(req.body.pass);
                console.log(encpwd);
                console.log(pwdhash);
            
                if (encpwd != results[0].password) {
                    // password non coincidenti
                    console.log('Password errata!');
                    error = {
                        myError : 'PASS'
                    };
              res.redirect('/accedi')
                } else {
                    
                    console.log('Utente autenticato');
                    console.log(results);
                   
                    req.session.utente = results[0]
                     if (results[0].tipo_utente == "Utente"){
                         result = await db.query('SELECT * from noleggio where ref_IDutente = (?)  \
                         ORDER BY noleggio.al ASC',[
                             req.session.utente.ID_utente
                         ])
                         .catch(err => {
                            throw err;
                        });
                         if (result.length > 0) {
                         const today = new Date();
                             const end = result[0].al;
                             var diff = end - today;
                             var hours_rem = (diff / 86400000) * 24 ;
                             console.log(today,end, diff, hours_rem);
                         if(hours_rem <= 1 && hours_rem >= 0){                            
                         res.redirect('/users/mieiNoleggi')
                        console.log('load miei noleggi')}
                         else{

                            notifica = {
                                counter : 0,
                                string : 'login'
                            };
                               
                            
                           res.redirect('/')
                        }
                    
                    }
                
                    res.redirect('/')}
                        else if(results[0].tipo_utente == "Amministratore"){
                            notifica = {
                                counter : 0,
                                string : 'login'
                            };
                               
                                
                           res.redirect('/');}
                           else if(results[0].tipo_utente == "Autista"){
                            notifica = {
                                counter : 0,
                                string : 'login'
                            };
                               
                               
                           res.redirect('/');}
                           else if(results[0].tipo_utente == "ImpiegatoParcheggio"){
                            notifica = {
                                counter : 0,
                                string : 'login'
                            };
                               
                               
                           res.redirect('/');} 
                }
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}



async function reg_amm(req, res, next) {
    const db = await makeDb(config); 
    let results = {};
    results = await db.query('SELECT * FROM `utente`\
            WHERE email = (?)', [
                    req.body.email
                ])
                .catch(err => {
                    throw err;
                });
                console.log(results.length);
            if (results.length != 0) {
                console.log('Utente già registarto');
                next(createError(404, 'Utente già registrato'));}
    
          else{
     
// inserimento utente
    try {
        await withTransaction(db, async() => { 

            // generazione della password cifrata con SHA512
            results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass]) //prende la password e applica la codifica sha2
                .catch(err => {
                    throw err;
                });

//gestione params autista

var stato = '';
var operatività = '';
if (req.body.tipo_utente == 'Autista'){
    stato = 'disponibile';
    operatività = '';
}


 



            let encpwd = results[0].encpwd;
            console.log('Password cifrata');
            console.log(results);
            results = await db.query('INSERT INTO `utente` (tipo_utente,nome,cognome,stato,operatività, data_nascita,telefono,cf,patente,regione,provincia,comune,email,password)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
                    req.body.tipo_utente,
                    req.body.name,
                    req.body.firstname,
                    stato,
                    operatività,
                    req.body.Data_di_Nascita,
                    req.body.phone,
                    req.body.cf,
                    req.body.patente,
                    req.body.region,
                    req.body.state,
                    req.body.town,
                    req.body.email,
                    encpwd
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`Utente ${req.body.email} inserito!`);
           
                res.redirect('/');
              

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
}

async function AggiungiMezzo(req, res, next) {
    const db = await makeDb(config); 
   
    try {
        await withTransaction(db, async() => { 
  

let type = req.body.main_menu;
let id_parcheggio = req.body.id_parcheggio;
console.log(type, id_parcheggio);

result = await db.query('select * from parcheggi where id_parcheggio = ?',[

    id_parcheggio
])

.catch(err => {
    throw err;
});

let comune = result[0].comune
let indirizzo = result[0].indirizzo

if (type == 'Bici' || type == 'Monopattino'){
    var cilindrata = 'none'
    var cavalli = 'none'
    var targa = 'none'
    var assicurazione = 'none'
}

else{
    var cilindrata = req.body.cilindrata
    var cavalli = req.body.cavalli
    var targa = req.body.targa
    var assicurazione = req.body.assicurazione
}

      
           console.log('avvio query: ..')
            results = await db.query('INSERT INTO `mezzi` (tipo_mezzo, modello,cilindrata,cavalli,targa,assicurazione,foto,descrizione,tariffa, ref_IDparcheggio , ref_comune, ref_indirizzo)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
         
            type,
            req.body.sub_menu,
                   cilindrata,
                   cavalli,
                   targa,
                   assicurazione,
                   req.body.foto,
                   req.body.descrizione,
                   req.body.tariffa,
                   id_parcheggio,
                   comune,
                   indirizzo
                  
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`mezzo ${req.body.main_menu} inserito!`);
            notifica = {
                counter : 0,
                string : 'mezzo aggiunto'
            };


                res.redirect('/');
              

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}





async function noleggioMezzo(req,res,next){

    const db = await makeDb(config);
let date1 = new Date(req.body.dal);
let date2 = new Date(req.body.al);
let diff = (date2 - date1);
let hours = (diff / 86400000) * 24 ;
let autista = req.body.Autista

if (autista == "si"){
    destinazione = req.body.Destinazione;
    var mancia = parseInt(req.body.Mancia);
}

else{
   autista = "no";
  destinazione = "null";
var  mancia = 0;
}
console.log(date1, date2,diff, hours);




noleggio = {
    noleggio_autista : autista, 
    noleggio_dove : req.body.town,
    noleggio_dal : req.body.dal,
    noleggio_al  : req.body.al,
    noleggio_diff : hours,
    noleggio_destinazione : destinazione,
    noleggio_mancia : mancia
    
}
 console.log(req.body.Mezzo)

    console.log(noleggio);


    try{

     


await withTransaction(db, async() => {
        results = await db.query('select * \
                                  from `mezzi`\
                                  where (mezzi.tipo_mezzo = (?) \
                                  AND mezzi.ref_comune = (?)) \
                                  AND (mezzi.ID_mezzo not in \
                                                            (select ref_IDmezzo \
                                                             from noleggio \
                                                             where ? > noleggio.dal  \
                                                             AND  ? < noleggio.al )) ', [            
            
            req.body.Mezzo,
            req.body.town,
            req.body.dal,
            req.body.al
        
        
        ])

     
        .catch(err => {
            throw err; 
        }); 

       
        console.log(results);

req.session.mezzi = results;

res.redirect('/NoleggioPT1');

});
} catch (err) {
var message =  'errore di sistema';
next(createError(message));
}
}


async function NoleggioPT2 (req, res, next){
    const db = await makeDb(config);

    try {
        await withTransaction(db, async() => {
            results = await db.query('SELECT * \
            FROM mezzi \
            WHERE ID_mezzo = ?', [

            req.body.ID_mezzo
            
            ])
            .catch(err => {
                throw err; 
            });
 
            console.log(results[0]);
      
           
req.session.mezzo = results[0];


let mancia = noleggio.noleggio_mancia
let tariffa = req.session.mezzo.tariffa ;
let dove = req.session.mezzo.ref_indirizzo;
let comune = noleggio.noleggio_dove
let dal = noleggio.noleggio_dal;
let al = noleggio.noleggio_al;
var prezzo = noleggio.noleggio_diff * tariffa + mancia;
let foto = req.session.mezzo.foto
console.log(prezzo);
console.log(prezzo);
let destinazione = noleggio.noleggio_destinazione;
let autista = noleggio.noleggio_autista; 

console.log(tariffa,dove,dal,al,prezzo)

noleggioUP = {
 dove : dove,
 dal : dal,
 al : al,
 mezzo: req.session.mezzo.ID_mezzo,
 prezzo :  prezzo,
 destinazione : destinazione,
 autista : autista,
 comune : comune,
 foto : foto
}

console.log(noleggioUP)

   res.redirect('/NoleggioPT2');
    
});
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}





function NoleggioPT5 (req, res,next){
    
try{

carta = req.session.utente.carta;
if(req.body.myCC == carta ){
pagamento = {
  P_carta : carta,
  P_cvv : req.session.utente.cvv,
  P_scadenza : req.session.utente.mese}
}
  else{
    pagamento = {
      P_carta : req.body.cardNumber,
      P_cvv : req.body.cvv,
      P_scadenza : req.body.mese
    }
  }
  console.log(pagamento);
   res.redirect('/NoleggioPT4');
}

 catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}



   
 async function NoleggioFine (req, res, next){
     const db = await makeDb(config);
     try {


        if (noleggioUP.autista == 'no'){
            var stato = 'accettato'
            comune = noleggioUP.comune
        } 

        else{
            var stato = 'in accettazione'
           comune = noleggioUP.comune
        }
         await withTransaction(db, async() => {
             results = await db.query('insert into noleggio (ref_IDutente,carta,ref_IDmezzo,dal,al,autista,destinazione,dove,stato,comune,prezzo,foto) values (?,?,?,?,?,?,?,?,?,?,?,?)', [
           req.session.utente.ID_utente,
           pagamento.P_carta,
            noleggioUP.mezzo,
           noleggioUP.dal,
           noleggioUP.al,
           noleggioUP.autista,
           noleggioUP.destinazione,
           noleggioUP.dove,
           stato,
           comune,
           noleggioUP.prezzo,
           noleggioUP.foto
            ])
            .catch(err => {
                throw err; 
            });
 
            console.log(results[0]);
      
            notifica = {
                counter : 0,
                string : 'noleggio effettuato'
            };

    res.redirect('/');
    
 });
 } catch (err) {
     var message =  'errore di sistema';
     next(createError(message));
 }
 }

 async function mieiNoleggi (req, res, next){
    const db = await makeDb(config);
    let myID = req.session.utente.ID_utente;
    console.log(myID);
    try {

        consegnatoString = 'consegnato'
        await withTransaction(db, async() => {
            results = await db.query('select * from noleggio where noleggio.ref_IDutente = (?) AND noleggio.stato <> (?) ORDER BY noleggio.al ', [
                  myID,
                  consegnatoString
           ])
           .catch(err => {
               throw err; 
           });


 if (results.length > 0){
    
           const date = new Date(results[0].al);

          var y = date.getFullYear();
          var m = date.getMonth();
          var d = date.getUTCDate();
          var h = date.getHours();
          var min = date.getMinutes();
          var s = date.getSeconds();
           console.log(date,y,m,d,h,min,s);

           timer = {

            t_y : y,
            t_m : m,
            t_d : d,
            t_h : h,
            t_min : min,
            t_s : s
           }
           req.session.mieiNoleggi = results;
console.log(req.session.mieiNoleggi);

   res.redirect('/mieiNoleggi');
        }

        else {
timer= {}
req.session.mieiNoleggi = results;
console.log(req.session.mieiNoleggi);

res.redirect('/mieiNoleggi')
    }
});
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}

async function mioNoleggio (req, res, next){
    const db = await makeDb(config);
    let myID = req.session.utente.ID_utente;
    let myIDnoleggio = req.body.ID_noleggio
    console.log(myID);
    try {

        await withTransaction(db, async() => {

            if (req.session.utente.tipo_utente == 'Utente'){ 
            results = await db.query('select * from noleggio where noleggio.ref_IDutente = (?) and ID_noleggio = (?) ', [
myID,
myIDnoleggio
           ])
           .catch(err => {
               throw err; 
           });


req.session.mionoleggio = results[0];
console.log(req.session.mionoleggio)

   res.redirect('/modificaNoleggio');
}


//comunicazione ritardo di consegna da parte dell'autista
else if (req.session.utente.tipo_utente == 'Autista'){ 
    results = await db.query('select * from noleggio where noleggio.autista = (?) and id_noleggio = (?) ', [
myID,
myIDnoleggio
   ])
   .catch(err => {
       throw err; 
   });


req.session.mionoleggio = results[0];
console.log(req.session.mionoleggio)

res.redirect('/modificaNoleggio');
}


else{
    noleggio = results[0];
    res.redirect('/landModNol')
}
});
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}


async function ultimaModifica (req, res, next){
    const db = await makeDb(config);

    if (req.session.utente.tipo_utente == 'Utente'){
    let myIDnoleggio = req.session.mionoleggio.ID_noleggio
    console.log(myIDnoleggio);
    try {
        await withTransaction(db, async() => {


mezzoo = await db.query('select * from mezzi where ID_mezzo = (?)',[

    req.session.mionoleggio.ref_IDmezzo
]).catch(err => {
    throw err; 
});

console.log(mezzoo[0])
var tariffaa = mezzoo[0].tariffa
let date11 = new Date (req.body.dal).getTime();
let date22 = new Date (req.body.al).getTime();
let diff1 = (date22 - date11);
hours1 = (diff1 / 86400000) * 24 ;
var prezzo1 = hours1 * tariffaa

console.log(req.body.dal,req.body.al,hours1,prezzo1)
            results = await db.query('UPDATE noleggio set noleggio.dal = (?), noleggio.al = (?), noleggio.prezzo = (?), noleggio.dove = (?) where ID_noleggio = (?) ', [
                req.body.dal,
                req.body.al,
                prezzo1,
                req.body.Destinazione,
                myIDnoleggio
           ])
           .catch(err => {
               throw err; 
           });

 
           results1 = await db.query('select * from noleggio where ID_noleggio = (?) ', [
            myIDnoleggio
                       ])
                       .catch(err => {
                           throw err; 
                       });
            
             
            req.session.mionoleggio = results1[0];
            console.log(req.session.mionoleggio)


            notifica = {
                counter : 0,
                string : 'modifica effettuata'
            };
            
               res.redirect('/');


               
            });
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));

}
}
else{

   
    let myIDnoleggio = req.session.mionoleggio.ID_noleggio
    console.log(myIDnoleggio);
    try {
        await withTransaction(db, async() => {


mezzoo = await db.query('select * from mezzi where ID_mezzo = (?)',[

    req.session.mionoleggio.ref_IDmezzo
]).catch(err => {
    throw err; 
});

console.log(mezzoo[0])
var tariffaa = mezzoo[0].tariffa
let date11 = new Date (req.body.dal).getTime();
let date22 = new Date (req.body.al).getTime();
let diff1 = (date22 - date11);
hours1 = (diff1 / 86400000) * 24 ;
var prezzo1 = hours1 * tariffaa

console.log(req.body.dal,req.body.al,hours1,prezzo1)
            results = await db.query('UPDATE noleggio set noleggio.dal = (?), noleggio.al = (?), noleggio.prezzo = (?) where ID_noleggio = (?) ', [
                req.body.dal,
                req.body.al,
                prezzo1,
                myIDnoleggio
           ])
           .catch(err => {
               throw err; 
           });

 
           results1 = await db.query('select * from noleggio where ID_noleggio = (?) ', [

            myIDnoleggio
                       ])
                       .catch(err => {
                           throw err; 
                       });
            
             
            req.session.noleggio = results1[0];
            console.log(noleggio)
            notifica = {
                counter : 0,
                string : 'modifica effettuata'
            };
               res.redirect('/');
               
            });
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));

}}
}


// Registrazione nuovo Parcheggio
async function AggiungiParcheggio(req, res, next) {
    const db = await makeDb(config); 
//mezzi autorizzati   
if(req.body.mezzo_auto=="si"){
var mezzo_auto = "si"
}
else{
    var mezzo_auto = "no";

}
if(req.body.mezzo_moto=="si"){
    var mezzo_moto = "si"
    }
    else{
        var mezzo_moto = "no";
    }
    if(req.body.mezzo_bici=="si"){
        var mezzo_bici = "si"
        }
        else{
            var mezzo_bici = "no";
        }
        if(req.body.mezzo_monopattino=="si"){
            var mezzo_monopattino = "si"
            }
            else{
                var mezzo_monopattino = "no";
            }

            let tipo_utente='ImpiegatoParcheggio'
            results = await db.query('SELECT ID_utente FROM `utente`\
             WHERE utente.ID_utente=(?) AND utente.ID_utente IN (SELECT ID_utente FROM utente) AND utente.tipo_utente=(?)\
              AND utente.ID_utente NOT IN (SELECT ref_IDimp FROM parcheggi)     ', [
                req.body.ref_IDimp,
                   tipo_utente
                ])
                .catch(err => {
                    throw err;
                });
                console.log(results);
            if (results.length ==0) {
                console.log("L'impiegato ha già un parcheggio");
                next(createError(404, 'Impiegato già occupato'));}
    
          else{


    try {
        await withTransaction(db, async() => { 

           
            results = await db.query('INSERT INTO `parcheggi` (ref_IDimp, mezzo_auto, mezzo_moto, mezzo_bici, mezzo_monopattino, numero_auto, numero_moto, numero_bici, numero_monopattino, stato, descrizione, foto,comune,indirizzo)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
            req.body.ref_IDimp,
            mezzo_auto,
            mezzo_moto,
            mezzo_bici,
            mezzo_monopattino,
            req.body.numero_auto,
            req.body.numero_moto,
            req.body.numero_bici,
            req.body.numero_monopattino,
            req.body.stato,
            req.body.descrizione,
            req.body.foto,
            req.body.town,
            req.body.Indirizzo
           
                   
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`parcheggio ${req.body.descrizione} inserito!`);

            notifica = {
                counter : 0,
                string : 'parcheggio aggiunto'
            };
                res.redirect('/');

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
}

async function datiparcheggio (req,res,next) {
    const db = await makeDb(config);
    try {
        await withTransaction(db, async() => {
            results = await db.query('Select * from `parcheggi` where ref_IDimp = ?' ,
            [ req.session.utente.ID_utente ])
        
           
        .catch(err => {
            throw err;
        });
   
        console.log(results);

        req.session.parcheggio = results[0];

        res.redirect('/datiparcheggio')

});
} catch (err) {
var message =  'errore di sistema';
next(createError(message));
}
}



async function modificadatiParcheggio(req, res, next) {
    const db = await makeDb(config); 

//mezzi autorizzati   
if(req.body.mezzo_auto=="si"){
    var mezzo_auto = "si"
    }
    else{
        var mezzo_auto = "no";
    }
    if(req.body.mezzo_moto=="si"){
        var mezzo_moto = "si"
        }
        else{
            var mezzo_moto = "no";
        }
        if(req.body.mezzo_bici=="si"){
            var mezzo_bici = "si"
            }
            else{
                var mezzo_bici = "no";
            }
            if(req.body.mezzo_monopattino=="si"){
                var mezzo_monopattino = "si"
                }
                else{
                    var mezzo_monopattino = "no";
                }
console.log('mezzo_auto')
    try {
        await withTransaction(db, async() => { 
            if(req.session.utente){
                results = await db.query('UPDATE parcheggi SET ref_IDimp = ?, mezzo_auto = ?, mezzo_moto = ?, mezzo_bici = ?, mezzo_monopattino = ?,\
                 numero_auto = ?, numero_moto = ?, numero_bici = ?, numero_monopattino = ?, stato = ?, descrizione = ?, foto = ? WHERE id_parcheggio = ?',
        
                 [
                   req.body.ref_IDimp,
                     mezzo_auto,
                     mezzo_moto,
                     mezzo_bici,
                     mezzo_monopattino,
                     req.body.numero_auto,
                     req.body.numero_moto,
                     req.body.numero_bici,
                     req.body.numero_monopattino,
                     req.body.stato,
                     req.body.descrizione,
                     req.body.foto,
                     req.session.parcheggio.id_parcheggio
                            
                         ])
                         .catch(err => {
                             throw err;
                            });
                            req.session.parcheggio.ref_IDimp = req.body.ref_IDimp,
                            req.session.parcheggio.mezzo_auto  = req.body.mezzo_auto,
                            req.session.parcheggio.mezzo_moto  = req.body.mezzo_moto,
                            req.session.parcheggio.mezzo_bici = req.body.mezzo_bici,
                            req.session.parcheggio.mezzo_monopattino = req.body.mezzo_monopattino,
                            req.session.parcheggio.numero_auto = req.body.numero_auto,
                            req.session.parcheggio.numero_moto = req.body.numero_moto,
                            req.session.parcheggio.numero_bici = req.body.numero_bici,
                            req.session.parcheggio.numero_monopattino = req.body.numero_monopattino,
                            req.session.parcheggio.stato = req.body.stato,
                            req.session.parcheggio.descrizione = req.body.descrizione,
                            req.session.parcheggio.foto = req.body.foto,
                            notifica = {
                                counter : 0,
                                string : 'parcheggio modificato'
                            };
                           res.redirect('/DatiParcheggioMod');
                        }
                
                        
                    });
                } catch (err) {
                    var message =  'errore di sistema';
                    next(createError(message));
                }
            }









async function elencomezziParcheggio (req, res, next){
    const db = await makeDb(config);
    let results = {};
    try {
  
      myID = req.session.utente.ID_utente;
        console.log(myID);
      await withTransaction(db, async() => {
            results = await db.query('SELECT * \
            FROM parcheggi \
            WHERE ref_IDimp = ?', [
  
            myID
            
            ])
            .catch(err => {
                throw err; 
            });
  

            results1 = await db.query('SELECT * \
            FROM mezzi \
            WHERE ref_IDparcheggio = ? ',[
  
            results[0].id_parcheggio
            
             ])
      
  });
  console.log(results);
    req.session.oggetto = results;


  req.session.mezziP = results1;
  
res.redirect('/elencomezziParcheggio');

  } catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
  }
  }



 

  async function trovaIncarichi(req, res, next){
    const db = await makeDb(config);
    let results = {};
    try {
  
      myID = req.session.utente.ID_utente;
        console.log(myID);
        string = 'in accettazione';
      await withTransaction(db, async() => {
            results = await db.query('SELECT * \
            FROM noleggio \
            WHERE comune = ? AND (stato = ?)' , [
  
          req.body.town,
          string
            
            ])
            .catch(err => {
                throw err; 
            });
  
  
  });
  console.log(results);
    req.session.incarichi = results;
    res.redirect('/incarichi');
  } catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
  }
  }

  async function accettaIncarico(req,res,next){
const db = await makeDb(config);

accettato = 'accettato'
try{
 accetta = await db.query('UPDATE noleggio set noleggio.stato = (?), noleggio.autista = (?)  WHERE noleggio.id_noleggio = (?)  ',[

accettato,
req.session.utente.ID_utente,
req.body.ID_noleggio

 ]).catch(err => {
    throw err; 
});

statoString = 'in corsa'
stato = await db.query('Update utente set utente.stato = (?) WHERE ID_utente = (?)',[

statoString,
req.session.ID_utente


])
    
notifica = {
    counter : 0,
    string : 'incarico accettato'
};


res.redirect('/')


} catch(err) {
    var message = 'errore di sistema';
    next(createError(message));
}
  }




  async function consegnato(req,res,next){
    const db = await makeDb(config);
    
    Stringconsegnato = 'consegnato'
    let date = new Date();
    try{
     consegna = await db.query('UPDATE noleggio set noleggio.stato = (?), noleggio.al = (?) WHERE noleggio.id_noleggio = (?)  ',[
    
    Stringconsegnato,
    date,
    req.body.ID_noleggio
    
     ]).catch(err => {
        throw err; 
    });
    
    notifica = {
        counter : 0,
        string : 'consegna effettuata'
    };

    res.redirect('/')
    
    
    } catch(err) {
        var message = 'errore di sistema';
        next(createError(message));
    }
      }
    
      async function ricercaMezzo (req, res, next){
        const db = await makeDb(config);
        let results = {};
        error = {}
        try {
            await withTransaction(db, async() => {
                results = await db.query('SELECT * \
                FROM mezzi \
                WHERE ID_mezzo = ?', [
    
                req.body.ID_mezzo
                
                ])
                .catch(err => {
                    throw err; 
                });
     
                console.log(results[0]);
        if (results.length < 1){
            error = {
                myError : 'MI'
                }
            res.redirect('/RicercaMezzoBASIC');
        }
    req.session.mezzo = results[0];
   
     res.redirect('/DatiMezzo')
        
    });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
    }

    async function modificaMezzo(req,res,next){
const db = await makeDb(config);
try{
    await withTransaction(db, async() => {
        modifica = await db.query('UPDATE mezzi set targa = ?, assicurazione = ?, tariffa = ?, foto = ?, descrizione = ?\
                                   WHERE ID_mezzo = ?', [

                                    req.body.targa,
                                    req.body.assicurazione,
                                    req.body.tariffa,
                                    req.body.foto,
                                    req.body.descrizione,
                                    req.session.mezzo.ID_mezzo
                                   ]).catch(err => {
                                    throw err; 
                                });

                                req.session.mezzo.targa =  req.body.targa,
                                req.session.mezzo.assicurazione =  req.body.assicurazione,
                                req.session.mezzo.tariffa = req.body.tariffa,
                                req.session.mezzo.foto = req.body.foto,
                                req.session.mezzo.descrizione = req.body.descrizione

                                notifica = {
                                    counter : 0,
                                    string : 'mezzo modificato'
                                };

                                res.redirect('/DatiMezzo')

});

}catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}


async function cancellaMezzo(req,res,next){
    const db = await makeDb(config);
    try{
        await withTransaction(db, async() => {
            modifica = await db.query('DELETE \
                                       FROM mezzi \
                                       WHERE ID_mezzo = ?', [
    
                                    
                                        req.session.mezzo.ID_mezzo
                                       ]).catch(err => {
                                        throw err; 
                                    });
    
                                    res.redirect('/')
    
    });
    
    }catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
    }

    async function ricercaParcheggio(req,res,next){
        const db = await makeDb(config);
        error = {}
        try{
            await withTransaction(db, async() => {
if (req.session.utente.tipo_utente == 'ImpiegatoParcheggio'){

    ricerca = await db.query('select * from parcheggi where ref_IDimp = (?) ',[

        req.session.utente.ID_utente
    ]).catch(err => {
        throw err; 
    });
    req.session.parcheggio = ricerca[0];
    res.redirect('/DatiParcheggioMod')
}

else{
                
                ricerca = await db.query('SELECT * \
                                           FROM parcheggi \
                                           WHERE id_parcheggio = ?', [
        
                                        
                                            req.body.ID_parcheggio

                                           ]).catch(err => {
                                            throw err; 
                                        });

                                        if (ricerca.length < 1){
                                            error = {
                                                myError : 'MI'
                                                }
                                            res.redirect('/ricercaParcheggio');
                                        }
        req.session.parcheggio = ricerca[0];
                                        res.redirect('/DatiParcheggioMod')
                                    }        
        });
        
        }catch (err) {
            var message =  'errore di sistema';
            next(createError(message));
        }
        }
    

        async function cancellaParcheggio(req,res,next){
            const db = await makeDb(config);
            try{
                await withTransaction(db, async() => {
                    cancellaPar = await db.query('DELETE FROM `parcheggi` WHERE `parcheggi`.`id_parcheggio` = ?', [
            
                                            
                                                parcheggio.id_parcheggio
                                               ]).catch(err => {
                                                throw err; 
                                            });
            
                                            res.redirect('/')
            
            });
            
            }catch (err) {
                var message =  'errore di sistema';
                next(createError(message));
            }
            }


            async function SegnalaGuasto(req, res, next) {
                const db = await makeDb(config); 
                let results = {};
            
                 
      
                try {
                    await withTransaction(db, async() => { 
            

results = await db.query('select * from mezzi where ID_mezzo = (?) ',
[
        req.body.ID_mezzo, 
    
    ])
    .catch(err => {
        throw err;
    });
    if (results.length <1){
        notifica = {
            counter : 0,
            string : 'ERRORE'
        };

        res.redirect('/SegnalaGuasto')
    }
else{    

                        console.log(results);
                        results = await db.query('INSERT INTO `guasti` (ID_mezzo, descrizione_guasto, foto_guasto) VALUES (?,?,?) ',
                    [
                                req.body.ID_mezzo, 
                                req.body.descrizione_guasto,
                                req.body.foto_guasto
                            ])
                            .catch(err => {
                                throw err;
                            });


                        console.log(`Guasto segnalato!`);

                        if (req.session.utente.tipo_utente == 'Utente'){
                            notifica = {
                                counter : 0,
                                string : 'guasto segnalato'
                            };
                            res.redirect('/');
                        }
                        else{
                            notifica = {
                                counter : 0,
                                string : 'guasto segnalato'
                            };
                            res.redirect('/');
                        }}   
            
                    });
                } catch (err) {
                    var message =  'errore di sistema';
                    next(createError(message));
                }
            }


async function mieiIncarichi(req,res,next){
    const db = await makeDb(config);
    let myID = req.session.utente.ID_utente;
    console.log(myID);
    try {

        statoString = 'accettato'
        await withTransaction(db, async() => {
            results = await db.query('select * from noleggio where noleggio.autista = (?) AND noleggio.stato = (?) ORDER BY noleggio.al ', [
                  req.session.utente.ID_utente,
                  statoString
           ])
           .catch(err => {
               throw err; 
           });


 if (results.length > 0){
    
           const date = new Date(results[0].al);

          var y = date.getFullYear();
          var m = date.getMonth();
          var d = date.getUTCDate();
          var h = date.getHours();
          var min = date.getMinutes();
          var s = date.getSeconds();
           console.log(date,y,m,d,h,min,s);

           timer = {

            t_y : y,
            t_m : m,
            t_d : d,
            t_h : h,
            t_min : min,
            t_s : s
           }
           req.session.noleggio = results;
console.log (req.session.noleggio);

   res.redirect('/mieiIncarichi');
        }

        else {
timer= {}
req.session.noleggio = results;
console.log(  req.session.noleggio);

res.redirect('/mieiIncarichi')
    }
});
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}

async function cercaUtenze(req, res, next) {
    const db = await makeDb(config);
    let results = {};
   
    try {


        error = {
            myError : ''
        };
        await withTransaction(db, async() => {

            results = await db.query('SELECT * FROM `utente`\
            WHERE ID_utente = (?)', [
                    

                req.body.ID_utente
                ])
                .catch(err => {
                    throw err;
                });
            if (results.length == 0) {
                error = {
                    myError : 'MI'
                };
                console.log('Utente non trovato!');
               res.redirect('/cercaUtenze');
            }
           
          
                  else{
                    
                    console.log('Utente Trovato');
                    console.log(results);
                   
                    utente = results[0]
                res.redirect('/datiUtenteC');
                  }   
                    
                
                  
                        
               
            
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function cercaNoleggi(req, res, next) {
    const db = await makeDb(config);
    let results = {};
   
    try {


        error = {
            myError : ''
        };
        await withTransaction(db, async() => {

            results = await db.query('SELECT * FROM `noleggio`\
            WHERE ID_noleggio = (?)', [
                    

                req.body.ID_noleggio
                ])
                .catch(err => {
                    throw err;
                });
            if (results.length == 0) {
                error = {
                    myError : 'MI'
                };
                console.log('Noleggio non trovato!');
               res.redirect('/cercaNoleggio');
            }
           
          
                  else{
                    
                    console.log('Noleggio Trovato');
                    console.log(results);
                   
                    req.session.noleggio = results[0]
                res.redirect('/datiNoleggioC');
                  }   
                    
                
                  
                        
               
            
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

async function cancellaNoleggio(req,res,next){
    const db = await makeDb(config);
    try{
        await withTransaction(db, async() => {
            cancellaNol = await db.query('DELETE FROM `noleggio` WHERE ID_noleggio = ?', [
    
                                    
                                        req.body.ID_noleggio
                                       ]).catch(err => {
                                        throw err; 
                                    });
    
                                    res.redirect('/users/mieiNoleggi')
    
    });
    
    }catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
    }




// prova email
async function email(req,res,next){
    var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '0topnoleggi0@gmail.com',
    pass: 'Dario123.'
  }
});

var mailOptions = {
  from: '0topnoleggi0@gmail.com',
  to: 'dariobirtone@icloud.com',
  subject: 'Sending Email using Node.js, go there http://localhost:3000/',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


res.redirect('/')
}

// email per il recupero password
async function recuperoPassword(req,res,next){
    const db = await makeDb(config);
    let results = {};
    const toEmail = req.body.email 
    try {

        await withTransaction(db, async() => {

           

            results = await db.query('SELECT * FROM `utente`\
            WHERE email = (?)', [
                    

                toEmail
                ])
                .catch(err => {
                    throw err;
                });
console.log(results)
                if (results.length < 1 ){
                    notifica = {
                        string : 'UNT',
                        counter : 0
                    }
                    res.redirect('/recuperoPassword')
                }
                    else{
                        
                        var tkn = Math.floor(Math.random() * 99999);
                        result = db.query('UPDATE utente set tkn = ? WHERE utente.email = ? ',[
                            tkn,
                            toEmail
                        ]).catch(err => {
                            throw err;
                        });
                
                        var nodemailer = require('nodemailer');
                
               
                
                        var transporter = nodemailer.createTransport({
                          service: 'gmail',
                          auth: {
                            user: '0topnoleggi0@gmail.com',
                            pass: 'Dario123.'
                          }
                        });
                        
                        var mailOptions = {
                          from: '0topnoleggi0@gmail.com',
                          to: toEmail,
                          subject: 'no-reply, Top Noleggi Recupero Password',
                          text:  'Per recuperare la tua password vai qui: http://localhost:3000/ReimpostaPassword inserendo il seguente tkn: ' + tkn}
                        
                        transporter.sendMail(mailOptions, function(error, info){
                          if (error) {
                            console.log(error);
                          } else {
                            console.log('Email sent: ' + info.response);
                          }
                        });
                        
                        notifica = {
                            string : 'mail inviata',
                            counter : 0
                        }
                        res.redirect('/')
                        }});
                    }catch (err) {
                        var message =  'errore di sistema';
                        next(createError(message));
                    }
                    }
                    


//reimposta password
async function ReimpostaPassword(req,res,next){
    const db = await makeDb(config);
tkn = Math.floor(Math.random() * 9999)
const toEmail = req.body.email 
    try {

        await withTransaction(db, async() => {

           

            results = await db.query('SELECT * FROM `utente`\
            WHERE email = (?)', [
                    

                toEmail
                ])
                .catch(err => {
                    throw err;
                });
console.log(results)
                if (results.length < 1 ){
                    notifica = {
                        string : 'UNT',
                        counter : 0
                    }
                    res.redirect('/recuperoPassword')
                }
                    else{
  // generazione della password cifrata con SHA512
  results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass]) //prende la password e applica la codifica sha2
  .catch(err => {
      throw err;
  });



let encpwd = results[0].encpwd;

    results = await db.query('UPDATE utente set password = ?, tkn = ? where email = ? ', [
encpwd,
tkn,
req.body.email



    ]).catch(err => {
        throw err;
    });

res.redirect('/')

}});
}catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}                    
                
module.exports = router;