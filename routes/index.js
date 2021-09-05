const { render } = require('ejs');
var express = require('express');
var router = express.Router();

const { static } = require('express');
const { default: Swal } = require('sweetalert2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',  {title: 'Home', utente_loggato: req.session.utente});
});

router.get('/accedi', function(req, res, next) {
  res.render('Autenticazione', { title: 'Accedi', utente_loggato: req.session.utente});
  

});

router.get('/registrati', function(req, res, next) {
  res.render('registration', { title: 'Registrazione', utente_loggato: req.session.utente});
});
router.get('/acc', function(req, res, next) {
  res.render('profiloUtente', { title: 'Accedi', utente_loggato: req.session.utente  });
});

router.get('/reg_amministratore', function(req, res, next){
 res.render('regAmmform', {title: 'reg_amministratore', utente_loggato: req.session.utente});
});

router.get('/accedi_alert', function(req, res, next) {
  res.render('Autenticazione_error', { title: 'UNS', utente_loggato: req.session.utente});
});

router.get('/NoleggioMezzi', function(req, res, next) {
  res.render('NoleggioMezzi', { title: 'NM', utente_loggato: req.session.utente});
});

router.get('/AggiungiMezzo', function (req,res,next){
  res.render('AggiungiMezzo', {title: 'AM', utente_loggato: req.session.utente});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


router.get('/modificadati', function(req, res, next){
  res.render('modificadati', {title: 'Modifica dati', utente_loggato: req.session.utente});
});
// Parcheggio

router.get('/aggiungiparcheggio', function(req, res, next) {
  res.render('AggiungiParcheggioBASIC', { title: 'Aggiungi Parcheggio', utente_loggato: req.session.utente});
});

router.get('/ricercaparcheggio', function(req, res, next) {
  res.render('RicercaParcheggioBASIC', { title: 'Ricerca Parcheggio da modificare', utente_loggato: req.session.utente});
});

router.get('/elencoparcheggi', function(req, res, next) {
  res.render('ElencoParcheggiBASIC', { title: 'Visualizza i parcheggi desiderati', utente_loggato: req.session.utente});
});

router.get('/modificaparcheggio', function(req, res, next) {
  res.render('ModificaParcheggioBASIC', { title: 'Modifica Parcheggio', utente_loggato: req.session.utente});
});

router.get('/ricercamezzo', function(req, res, next) {
  res.render('RicercaMezzoBASIC', { title: 'Ricerca Mezzo', utente_loggato: req.session.utente});
});

router.get('/elencomezzi', function(req, res, next) {
  res.render('ElencoMezziBASIC', { title: 'Visualizza tutti i mezzi', utente_loggato: req.session.utente});
});

router.get('/impiegatoparcheggio', function(req, res, next) {
  res.render('ImpiegatoParcheggioBASIC', { title: 'Pagina dell Impiegato Parcheggio', utente_loggato: req.session.utente});
});


router.get('/RicercaMezzoBasic', function(req, res, next){
  res.render('RicercaMezzoBasic', {title: 'RM', utente_loggato: req.session.utente});
});


router.get('/DatiMezzo', function(req,res,next){
res.render("landingMezzo", {title: "dati_mezzi", utente_loggato: req.session.utente, mezzo: req.session.mezzo});
});

router.get('/NoleggioPT1', function(req,res,next){
res.render("landingNoleggio", {title: "mezzi_noleggiabili", utente_loggato: req.session.utente, mezzi: req.session.mezzi, noleggioo: noleggio});
})

router.get('/NoleggioPT2', function(req,res,next){
  res.render("landMezzoDaNoleggiare", {title: "mezzi_noleggiabili", utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP});
  })

  router.get('/NoleggioPT3', function(req,res,next){
    res.render("SelezionaPagamento", {title: 'Seleziona Pagamento',  utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP})
  })

  router.get('/NoleggioPT4', function(req,res,next){
    res.render("PanoramicaNoleggio", {title: 'Panoramica Noleggio',  utente_loggato: req.session.utente, mezzi: req.session.mezzo, noleggio: noleggioUP, pagamentoNoleggio: pagamento})
  })

  router.get('/mieiNoleggi', function(req,res,next){
    res.render("landMieiNoleggi",{title: 'miei noleggi', utente_loggato : req.session.utente, noleggi : req.session.mieiNoleggi, rimanenti : timer})
  })

  router.get('/modificaNoleggio', function(req,res,next){
    res.render('landDatiNoleggio',{title : 'mio noleggio', utente_loggato : req.session.utente, mio_Noleggio :req.session.mionoleggio })
  })

  router.get('/aggiungiparcheggio', function(req, res, next) {
    res.render('AggiungiParcheggioBASIC', { title: 'Aggiungi Parcheggio', utente_loggato: req.session.utente});
  });
  
  router.get('/modificaParcheggio', function(req, res, next) {
    res.render('ModificaParcheggioBASIC', { title: 'Modifica Parcheggio da modificare', utente_loggato: req.session.utente});
  });
  
  router.get('/elencomezziParcheggio', function(req,res,next){
    res.render("ElencoMezzi",{title : 'elencomezziParcheggio', utente_loggato: req.session.utente, parche:req.session.oggetto, mezzi: req.session.mezziP});
    });
  
  router.get('/impiegatoparcheggio', function(req, res, next) {
    res.render('ImpiegatoParcheggioBASIC', { title: 'Pagina dell Impiegato Parcheggio', utente_loggato: req.session.utente});
  });
  
  router.get('/modificadatiParcheggio', function(req, res, next){
    res.render('ModificaParcheggioBASIC', {title: 'Modifica dati Parcheggio', utente_loggato: req.session.utente, parcheggio: req.session.parcheggio});
  });
  
  router.get('/datiparcheggio', function(req, res, next) {
    res.render('profiloParcheggio', { title: 'Dati Parcheggio', utente_loggato: req.session.utente, parcheggio: req.session.parcheggio});
  });

  router.get('/segnalaGuasto', function(req, res, next){
    res.render('SegnalaGuasto', {title: 'RM', utente_loggato: req.session.utente});
  });
  

module.exports = router;
  