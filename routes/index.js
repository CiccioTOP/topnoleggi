const { render } = require('ejs');
var express = require('express');
var router = express.Router();

const { static } = require('express');
const { default: Swal } = require('sweetalert2');


notifica = {}

/* GET home page. */
router.get('/', function(req, res, next) {
 
  error = {
    myError : ''
  };    
  utente_loggato = req.session.utente;

  if(!utente_loggato){
    tipo_utente = ''
    res.render('index',  {title: 'Home', utente_loggato: req.session.utente, ErrorHandler: error, notifica : notifica, tipo_utente: tipo_utente});
    
  }
  if(utente_loggato.tipo_utente == 'Utente'){
    tipo_utente = req.session.utente.tipo_utente
    res.render('index',  {title: 'Home', utente_loggato: req.session.utente, ErrorHandler: error, notifica : notifica, tipo_utente: tipo_utente});
    notifica.counter = notifica.counter + 1;
  }

  else if(utente_loggato.tipo_utente == 'Autista'){
    tipo_utente = req.session.utente.tipo_utente
    res.render('IndexAutista', {title: 'autista', utente_loggato: req.session.utente, notifica : notifica, tipo_utente: tipo_utente});
    notifica.counter =notifica.counter + 1;
  }

  else if(utente_loggato.tipo_utente == 'ImpiegatoParcheggio'){
    tipo_utente = req.session.utente.tipo_utente
    res.render('ImpiegatoParcheggio', { title: 'Pagina dell Impiegato Parcheggio', utente_loggato: req.session.utente, notifica : notifica,
     tipo_utente: tipo_utente});
     notifica.counter = notifica.counter + 1;
  }


  else if(utente_loggato.tipo_utente == 'Amministratore'){
    res.render('IndexAmministratore', {title: 'amministratore', utente_loggato: req.session.utente, notifica : notifica, tipo_utente: tipo_utente});
    notifica.counter = notifica.counter + 1;
  }

  else{res.render('index',  {title: 'Home', utente_loggato: req.session.utente, ErrorHandler: error});
}
});


router.get('/accedi', function(req, res, next) {
  res.render('Autenticazione', { title: 'Accedi', utente_loggato: req.session.utente,  ErrorHandler: error, notifica : notifica});
notifica.counter = notifica.counter + 1
});

router.get('/recuperoPassword', function(req,res,next){
  res.render('RecuperoPassword',{title: 'recupero password', utente_loggato : req.session.utente, notifica : notifica});
notifica.counter = notifica.counter + 1
});

router.get('/amministratore', function(req,res,next){
  res.render('IndexAmministratore', {title: 'amministratore', utente_loggato: req.session.utente});
});

router.get('/gestione_utenze', function(req,res,next){
  res.render('GestioneUtenze', {title: 'gestione utenze', utente_loggato: req.session.utente});
});

router.get('/gestione_mezzi', function(req,res,next){
  res.render('GestioneMezzi', {title: 'gestione mezzi', utente_loggato: req.session.utente});
});

router.get('/gestioneParcheggi', function(req,res,next){
  res.render('GestioneParcheggi', {title: 'gestione parcheggi', utente_loggato: req.session.utente});
});
router.get('/registrati', function(req, res, next) {
  res.render('Registrazione', { title: 'Registrazione', utente_loggato: req.session.utente});
});
router.get('/acc', function(req, res, next) {
  res.render('ModificaProfilo', { title: 'Accedi', utente_loggato: req.session.utente  });
});

router.get('/reg_amministratore', function(req, res, next){
 res.render('RegistrazioneUtenza', {title: 'reg_amministratore', utente_loggato: req.session.utente});
});

router.get('/selezionaOperativita', function(req,res,next){
  res.render('selezionaOperativita', {title : 'op', utente_loggato: req.session.utente})
})

router.get('/NoleggioMezzo', function(req, res, next) {
  res.render('NoleggioMezzo', { title: 'NM', utente_loggato: req.session.utente});
});

router.get('/AggiungiMezzo', function (req,res,next){
  res.render('AggiungiMezzo', {title: 'AM', utente_loggato: req.session.utente, notifica : notifica});
  notifica.counter = notifica.counter + 1;
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


router.get('/datiparcheggio', function(req, res, next) {
  res.render('profiloParcheggio', { title: 'Dati Parcheggio', utente_loggato: req.session.utente, parcheggio: req.session.parcheggio});});



router.get('/modificadati', function(req, res, next){
  res.render('ModificaDati', {title: 'Modifica dati', utente_loggato: req.session.utente});
});
// Parcheggio

router.get('/aggiungiparcheggio', function(req, res, next) {
  res.render('AggiungiParcheggio', { title: 'Aggiungi Parcheggio', utente_loggato: req.session.utente , notifica: notifica})
  notifica.counter = notifica.counter + 1 
});


router.get('/elencoparcheggi', function(req, res, next) {
  res.render('ElencoParcheggi', { title: 'Visualizza i parcheggi desiderati', utente_loggato: req.session.utente});
});

router.get('/modificaparcheggio', function(req, res, next) {
  res.render('ModificaParcheggio', { title: 'Modifica Parcheggio', utente_loggato: req.session.utente,notifica : notifica});
  notifica.counter = notifica.counter + 1;
});


router.get('/elencomezzi', function(req, res, next) {
  res.render('ElencoMezzi', { title: 'Visualizza tutti i mezzi', utente_loggato: req.session.utente});
});

router.get('/DatiMezzo', function(req,res,next){
res.render("Mezzo", {title: "dati_mezzi", utente_loggato: req.session.utente, mezzo: req.session.mezzo, notifica: notifica});
notifica.counter = notifica.counter + 1;
});

router.get('/NoleggioPT1', function(req,res,next){
res.render("Noleggio", {title: "mezzi_noleggiabili", utente_loggato: req.session.utente, mezzi: req.session.mezzi, noleggioo: noleggio});
})

router.get('/NoleggioPT2', function(req,res,next){
  res.render("MezzoDaNoleggiare", {title: "mezzi_noleggiabili", utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP});
  })

  router.get('/NoleggioPT3', function(req,res,next){
    res.render("SelezionaPagamento", {title: 'Seleziona Pagamento',  utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP})
  })

  router.get('/NoleggioPT4', function(req,res,next){
    res.render("PanoramicaNoleggio", {title: 'Panoramica Noleggio',  utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP, pagamentoNoleggio: pagamento})
  })

  router.get('/mieiNoleggi', function(req,res,next){
    res.render("MieiNoleggi",{title: 'miei noleggi', utente_loggato : req.session.utente, noleggi : req.session.mieiNoleggi, rimanenti : timer})
  })

  router.get('/modificaNoleggio', function(req,res,next){
    res.render('DatiNoleggio',{title : 'mio noleggio', utente_loggato : req.session.utente, mio_Noleggio :req.session.mionoleggio })
  })

  router.get('/aggiungiparcheggio', function(req, res, next) {
    res.render('AggiungiParcheggio', { title: 'Aggiungi Parcheggio', utente_loggato: req.session.utente , notifica : notifica});
    notifica.counter = notifica.counter + 1;
  });
  
  router.get('/modificaParcheggio', function(req, res, next) {
    res.render('ModificaParcheggio', { title: 'Modifica Parcheggio da modificare', utente_loggato: req.session.utente});
  });
  
  router.get('/elencomezziParcheggio', function(req,res,next){
    res.render("ElencoMezzi",{title : 'elencomezziParcheggio', utente_loggato: req.session.utente, parche:req.session.oggetto, mezzi: req.session.mezziP});
    });
  
  
  router.get('/modificadatiParcheggio', function(req, res, next){
    res.render('ModificaParcheggio', {title: 'Modifica dati Parcheggio', utente_loggato: req.session.utente, parcheggio: req.session.parcheggio});
  });
  
  router.get('/segnalaGuasto', function(req, res, next){
    res.render('SegnalaGuasto', {title: 'RM', utente_loggato: req.session.utente, notifica: notifica});
    notifica.counter = notifica.counter + 1;
  });
  
router.get('/incarichi', function(req,res,next){
  res.render('AccettaIncarichi',{title : 'incarichi',utente_loggato: req.session.utente, incarichi: req.session.incarichi})
});

router.get('/VisualizzaMezzo', function(req,res,next){
  res.render('VisualizzaMezzo', {title : 'ricerca mezzo', utente_loggato: req.session.utente, ErrorHandler: error, mezzo: req.session.mezzo})
});

router.get('/modificaMezzo', function(req,res,next){
  res.render('ModificaMezzo', {title : 'modifica mezzo', utente_loggato : req.session.utente, mezzo: req.session.mezzo })
});

router.get('/ricercaParcheggio', function(req, res, next) {
  res.render('RicercaParcheggio', { title: 'Ricerca Parcheggio da modificare', utente_loggato: req.session.utente, ErrorHandler : error});
});

router.get('/DatiParcheggioMod', function(req,res,next){
  res.render('DatiParcheggioMod', {title : 'dati parcheggio', utente_loggato : req.session.utente, parcheggio : req.session.parcheggio, notifica: notifica})
  notifica.counter = notifica.counter + 1;
})


router.get('/mieiIncarichi', function(req,res,next){
  res.render('Incarichi', {title: 'miei incarichi', utente_loggato: req.session.utente, noleggi: req.session.noleggio, rimanenti : timer})
});

router.get('/CercaUtenza', function(req,res,next){
  res.render('CercaUtenza', {title: 'cerca utenza', utente_loggato: req.session.utente, ErrorHandler : error})
})

router.get('/datiUtenteC', function(req,res,next){
  res.render('utenteCercato', {title: 'dati Utente cercato', utente_loggato: req.session.utente, utente : utente})
})

router.get('/modificaUC', function(req,res,next){
  res.render('ModificaUtenza', {title: 'modifica dati Utente cercato', utente_loggato: req.session.utente, utente : utente})
})
router.get('/cercaNoleggio', function(req,res,next){
  res.render('CercaNoleggio', {title: 'cerca utenza', utente_loggato: req.session.utente, ErrorHandler : error})
})


router.get('/datiNoleggioC', function(req,res,next){
  res.render('DatiNoleggioC', {title : ' noleggio cercato', utente_loggato: req.session.utente, noleggi: req.session.noleggio})
});

router.get('/ModificaNoleggioAmministratore', function(req,res,next){
  res.render('ModificaNoleggioAmministratore', {title : 'modifica noleggio amministratore', utente_loggato: req.session.utente, noleggi: req.session.noleggio })
});

router.get('/QRcode', function(req,res,next){
  res.render('viewQRcode', {title : 'QRcode', utente_loggato : req.session.utente, noleggio : req.session.noleggio})
})


router.get('/ReimpostaPassword', function (req,res,next){
  res.render('ReimpostaPassword', {title: 'reimposta password', utente_loggato: req.session.utente, notifica: notifica})
notifica.counter = notifica.counter + 1;

})

module.exports = router;
  
