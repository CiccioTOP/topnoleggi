

var createError = require('http-errors');
var express = require('express');
var router = express.Router();

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');
const { default: Swal } = require('sweetalert2');

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

router.post('/ricercaMezzo', ricercaMezzo);

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

router.post('/SegnalaGuasto', SegnalaGuasto);



 //da cambiare 
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
                console.log('Utente già registrato');
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
           
                res.redirect('/accedi');
                
              

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
}


//fffffffffffffff


async function modificadati(req, res, next) {
    const db = await makeDb(config); 
    let results = {};
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


//fffffffffffffffffff

// middleware di autenticazione
async function autenticazione(req, res, next) {
    const db = await makeDb(config);
    let results = {};
    try {

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
                console.log('Utente non trovato!');
               res.redirect('/accedi_alert');
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
                    next(createError(403, 'Password errata'));
                } else {
                    
                    console.log('Utente autenticato');
                    console.log(results);
                    // recupero dello user id
                    // let id_utente = results[0].ID_UTENTE;

                    // results = await db.query('SELECT `utente', [
                    //         id_utente
                    //     ])
                    //     .catch(err => {
                    //         throw err;
                    //     });
                    // req.session.utente.ID_utente = results[0].ID_utente,
                  
                    // req.session.utente.nome  = results[0].nome,
                    // req.session.utente.cognome  = results[0].cognome,
                    // req.session.utente.data_nascita = results[0].data_nascita,
                    // req.session.utente.telefono = results[0].telefono,
                    // req.session.utente.cf = results[0].cf,
                    // req.session.utente.regione = results[0].regione,
                    // req.session.utente.provincia = results[0].provincia,
                    // req.session.utente.comune = results[0].comune,
                    // req.session.utente.carta =results[0].carta,
                    // req.session.utente.mese = results[0].mese,
                    // req.session.utente.cvv =results[0].cvv,
                    // req.session.utente.email = results[0].email,
                    // req.session.utente.password = results[0].password
                    req.session.utente = results[0]
                     if (results[0].tipo_utente == "Utente"){
                         result = await db.query('SELECT * from noleggio where ref_IDutente = (?)',[
                             req.session.utente.ID_utente
                         ])
                         if (result.length > 0) {
                         const today = new Date();
                             const end = result[0].al;
                             var diff = end - today;
                             var hours_rem = (diff / 86400000) * 24 ;
                             console.log(today,end, diff, hours_rem);
                         if(hours_rem < 1){                            
                         res.redirect('/users/mieiNoleggi')}}
                         else{
                        res.redirect('/')
                        }
                    }
                        else if(results[0].tipo_utente == "Amministratore"){
                          
                           res.redirect('/');}
                           else if(results[0].tipo_utente == "Autista"){
                           
                           res.redirect('/accedi');}
                           else if(results[0].tipo_utente == "ImpiegatoParcheggio"){
                           
                           res.redirect('/ImpiegatoParcheggio');}
                        
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

            let encpwd = results[0].encpwd;
            console.log('Password cifrata');
            console.log(results);
            results = await db.query('INSERT INTO `utente` (tipo_utente,nome,cognome,data_nascita,telefono,cf,patente,regione,provincia,comune,email,password)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
                    req.body.tipo_utente,
                    req.body.name,
                    req.body.firstname,
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
console.log(type);
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

      
           
            results = await db.query('INSERT INTO `mezzi` (tipo_mezzo, modello,cilindrata,cavalli,targa,assicurazione,foto,descrizione,tariffa )\
        VALUES (?,?,?,?,?,?,?,?,?)',
        [
                   
            type,
            req.body.sub_menu,
                   cilindrata,
                   cavalli,
                   targa,
                   assicurazione,
                   req.body.foto,
                   req.body.descrizione,
                   req.body.tariffa
                  
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`mezzo ${req.body.main_menu} inserito!`);
           
                res.redirect('/');
              

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}




async function ricercaMezzo (req, res, next){
    const db = await makeDb(config);
    let results = {};
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
   res.redirect('/DatiMezzo');
    
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
    noleggio_dove : req.body.dove,
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
        results = await db.query('select * from mezzi where mezzi.tipo_mezzo = (?) AND ((mezzi.ID_mezzo not in (select ref_IDmezzo from noleggio)) or (mezzi.ID_mezzo not in (select ref_IDmezzo from noleggio where noleggio.dal > ? and noleggio.al < ?))) ', [            
            req.body.Mezzo,
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
let dove = noleggio.noleggio_dove;
let dal = noleggio.noleggio_dal;
let al = noleggio.noleggio_al;
var prezzo = noleggio.noleggio_diff * tariffa + mancia;
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
 autista : autista
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
         await withTransaction(db, async() => {
             results = await db.query('insert into noleggio (ref_IDutente,carta,ref_IDmezzo,dal,al,autista,destinazione,dove) values (?,?,?,?,?,?,?,?)', [
           req.session.utente.ID_utente,
           pagamento.P_carta,
            noleggioUP.mezzo,
           noleggioUP.dal,
           noleggioUP.al,
           noleggioUP.autista,
           noleggioUP.destinazione,
           noleggioUP.dove
            ])
            .catch(err => {
                throw err; 
            });
 
            console.log(results[0]);
      

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
        await withTransaction(db, async() => {
            results = await db.query('select * from noleggio where noleggio.ref_IDutente = (?)', [
myID
           ])
           .catch(err => {
               throw err; 
           });

 
    
           req.session.mieiNoleggi = results;

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

console.log(req.session.mieiNoleggi);

   res.redirect('/mieiNoleggi');
   
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
   
});
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
}


async function ultimaModifica (req, res, next){
    const db = await makeDb(config);
    let myID = req.session.utente.ID_utente;
    let myIDnoleggio = req.session.mionoleggio.ID_noleggio
    console.log(myID,myIDnoleggio);
    try {
        await withTransaction(db, async() => {
            results = await db.query('UPDATE noleggio set noleggio.dal = (?), noleggio.al = (?) where noleggio.ref_IDutente = (?) and ID_noleggio = (?) ', [
req.body.dal,
req.body.al,
myID,
myIDnoleggio
           ])
           .catch(err => {
               throw err; 
           });

 
           results1 = await db.query('select * from noleggio where noleggio.ref_IDutente = (?) and ID_noleggio = (?) ', [
            myID,
            myIDnoleggio
                       ])
                       .catch(err => {
                           throw err; 
                       });
            
             
            req.session.mionoleggio = results1[0];
            console.log(req.session.mionoleggio)
            
               res.redirect('/');
               
            });
} catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
}
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

           
            results = await db.query('INSERT INTO `parcheggi` (ref_IDimp, mezzo_auto, mezzo_moto, mezzo_bici, mezzo_monopattino, numero_auto, numero_moto, numero_bici, numero_monopattino, stato, descrizione, foto)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
            req.body.regione,
            req.body.provincia,
            req.body.comune,
            req.body.indirizzo
           
                   
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`parcheggio ${req.body.descrizione} inserito!`);
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

    try {
        await withTransaction(db, async() => { 
            if(req.session.utente){
                results = await db.query('UPDATE parcheggi SET mezzo_auto = ?, mezzo_moto = ?, mezzo_bici = ?, mezzo_monopattino = ?,\
                 numero_auto = ?, numero_moto = ?, numero_bici = ?, numero_monopattino = ?, stato = ?, descrizione = ?, foto = ? WHERE id_parcheggio = ?',
        
                 [
                   
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
                     req.session.parcheggi.id_parcheggio
                            
                         ])
                         .catch(err => {
                             throw err;
                            });
                            req.session.parcheggi.mezzo_auto  = req.body.mezzo_auto,
                           req.session.parcheggi.mezzo_moto  = req.body.mezzo_moto,
                           req.session.parcheggi.mezzo_bici = req.body.mezzo_bici,
                           req.session.parcheggi.mezzo_monopattino = req.body.mezzo_monopattino,
                           req.session.parcheggi.numero_auto = req.body.numero_auto,
                           req.session.parcheggi.numero_moto = req.body.numero_moto,
                           req.session.parcheggi.numero_bici = req.body.numero_bici,
                           req.session.parcheggi.numero_monopattino = req.body.numero_monopattino,
                           req.session.parcheggi.stato = req.body.stato,
                           req.session.parcheggi.descrizione = req.body.descrizione,
                           req.session.parcheggi.foto = req.body.foto,
                           req.session.parcheggi.id_parcheggio = req.body.id_parcheggio
                           res.redirect('/');
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
        // dati_ricerca = {
        //     datacheckin: req.body.checkin,
        //     datacheckout: req.body.checkout,
        //     postiletto: req.body.postiletto
        // console.log(results);
    // dati_ricerca: dati_ricerca, inserzioni: results, resetfiltri: results
    // console.log('Dati Mezzo:');
    // console.log(results[0]);
    // res.render('RisultatiMezzo', {
    //     title: 'RisultatiMezzo',
    //     Mezzo: {
    //         mezzo: req.body.tipo_mezzo,
    //         data: results[0] 
    ///     }
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



  async function ricercaParcheggio (req, res, next){
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
  res.render("ElencoMezzi",{title : elencomezziParcheggio, utente_loggato: req.session.utente, parche:req.session.oggetto, mezzi: req.session.mezziP})
  } catch (err) {
    var message =  'errore di sistema';
    next(createError(message));
  }
  }


  async function SegnalaGuasto(req, res, next) {
    const db = await makeDb(config); 
    let results = {};

     
// registrazione guasto
    try {
        await withTransaction(db, async() => { 

            console.log(results);
            results = await db.query('INSERT INTO `guasti` (ID_mezzo, descrizione_guasto, foto_guasto) VALUES (?,?,?)',
        [
                    req.body.ID_mezzo, 
                    req.body.descrizione_guasto,
                    req.body.foto_guasto
                ])
                .catch(err => {
                    throw err;
                });
            console.log(`Guasto segnalato!`);
           
                res.redirect('/impiegatoparcheggio');
                

        });
    } catch (err) {
        var message =  'errore di sistema';
        next(createError(message));
    }
}
// }






module.exports = router;