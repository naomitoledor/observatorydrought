var express = require('express');
var router = express.Router();
var multer = require('multer'); //v
var upload = multer({ dest: 'uploads/' });//v
var fs = require('fs');//v
var o2x = require('object-to-xml');
var axios = require('axios'); ////

var postgressPass = require('../config');
const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://naomitoledo:' + postgressPass + '@localhost:5432/starwars2')

// Configuración de GeoServer
const geoserver_url = 'http://localhost:8080/geoserver';
const username = 'admin';
const password = 'talVBR214!-*';
const auth = { username: 'admin', password: 'talVBR214!-*' };

// GET Map data
router.get('/getMap', function(req, res, next) {
  const level = req.query.level;
  const year = req.query.year;
  const month = req.query.month;
  const layerName = `${level}_${year}${month.padStart(2, '0')}01`;
  const wmsUrl = `${geoserver_url}/wms`;
  res.json({ wmsUrl });
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Drought Observatory'});
});

//GET Drought Observatory page
router.get('/droughtobservatory', function (req, res) {
      res.render('index1', { titleIndex1: 'Mapviewer'});
});

//GET Data page
router.get('/data', function(req, res) {
  res.render('index2', { titleIndex2: 'Data'});
});

//GET Reference page
router.get('/reference', function(req, res) {
  res.render('index3', { titleIndex3: 'Reference'});
});

/* INDEX3*/
/* Buscar publicaciones*/
router.get('/publications', function(req, res, next) {
  let { author, year, title, keyword } = req.query;
  let query = `SELECT * FROM publications WHERE 1=1`;
  let params = [];

  if (author) {
    params.push(`%${author}%`);
    query += ` AND "author" ILIKE $${params.length}`;
  }
  if (year) {
    params.push(year);
    query += ` AND "year" = $${params.length}`;
  }
  if (title) {
    params.push(`%${title}%`);
    query += ` AND "title" ILIKE $${params.length}`;
  }
  if (keyword) {
    params.push(`%${keyword}%`);
    query += ` AND "title" ILIKE $${params.length}`;
  }

  query += ` ORDER BY "year" DESC`;

  db.any(query, params)
    .then((publications) => {
      res.render('index3', { titleIndex3: 'Reference', publications });
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    });
});

/* Añadir publicaciones*/
router.post('/add-publication', function(req, res, next) {
  const { author, year, title } = req.body;
  const query = 'INSERT INTO publications ("author", "year", "title", "submitted") VALUES ($1, $2, $3, $4)';
  db.none(query, [author, year, title, true])
    .then(() => {
      res.redirect('/publications');
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    });
});

/* Eliminar publicaciones*/
router.post('/delete-publication/:id', function(req, res, next) {
  const publicationID = req.params.id;
  const query = 'DELETE FROM publications WHERE id = $1 AND submitted = TRUE';
  db.result(query, [publicationID])
    .then((result) => {
      res.redirect('/publications');
    })
    .catch((error) => {
      console.log('ERROR:', error);
      next(error);
    });
});

  module.exports = router;