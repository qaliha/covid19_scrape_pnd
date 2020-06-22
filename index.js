const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')

const app = express()

let data_recent = null;

/**
 * Fetch the last data
 */
app.get('/', function (req, res) {

  if (data_recent == null) {
    return res.send({
      status: false,
      error: 'Belum ada data yang terkumpul'
    })
  }

  return res.send({
    status: true,
    data: data_recent
  })

})

var htmlEntities = {
  nbsp: ' ',
  cent: '¢',
  pound: '£',
  yen: '¥',
  euro: '€',
  copy: '©',
  reg: '®',
  lt: '<',
  gt: '>',
  quot: '"',
  amp: '&',
  apos: '\''
};

function unescapeHTML(str) {
  return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
    var match;

    if (entityCode in htmlEntities) {
      return htmlEntities[entityCode];
      /*eslint no-cond-assign: 0*/
    } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
      return String.fromCharCode(parseInt(match[1], 16));
      /*eslint no-cond-assign: 0*/
    } else if (match = entityCode.match(/^#(\d+)$/)) {
      return String.fromCharCode(~~match[1]);
    } else {
      return entity;
    }
  });
};

/**
 * Get last data from website
 * Scrape the data
 */
app.get('/fetch', async function (req, res) {

  try {
    /**
   * Get data page covid
   */
    const page = await axios.default.get('https://covid19.pangandarankab.go.id/data')
    const home = await axios.default.get('https://covid19.pangandarankab.go.id/')

    /**
     * Get with cheerio
     */
    const $ = cheerio.load(page.data)
    const $$ = cheerio.load(home.data)

    /**
     * Kumpulan data
     */
    const _confirmed = $('#content > div > div > section > div:nth-child(2) > div:nth-child(1) > div > div.sb-msg > div > span').attr('data-to')
    const _confirmed_active = $('#content > div > div > section > div:nth-child(2) > div:nth-child(2) > div > div.sb-msg > div > span').attr('data-to')
    const _confirmed_sembuh = $('#content > div > div > section > div:nth-child(2) > div:nth-child(3) > div > div.sb-msg > div > span').attr('data-to')
    const _confirmed_dead = $('#content > div > div > section > div:nth-child(2) > div:nth-child(4) > div > div.sb-msg > div > span').attr('data-to')

    const _confirmed_active_change = $('#content > div > div > section > div:nth-child(2) > div:nth-child(2) > div > div.sb-msg > div > a').html().replace(/\(|\)/, '')
    const _confirmed_sembuh_change = $('#content > div > div > section > div:nth-child(2) > div:nth-child(3) > div > div.sb-msg > div > a').html().replace(/\(|\)/, '')
    const _confirmed_dead_change = $('#content > div > div > section > div:nth-child(2) > div:nth-child(4) > div > div.sb-msg > div > a').html().replace(/\(|\)/, '')

    /**
     * ODP
     */
    const _odp_total = $('#content > div > div > section > div:nth-child(3) > div:nth-child(1) > div > div.sb-msg > div > div:nth-child(1) > div.counter.center > span').attr('data-to')
    const _odp_total_change = $('#content > div > div > section > div:nth-child(3) > div:nth-child(1) > div > div.sb-msg > div > div:nth-child(1) > div.counter.center > a').html().replace(/\(|\)/, '')
    const _odp_process = $('#content > div > div > section > div:nth-child(3) > div:nth-child(1) > div > div.sb-msg > div > div:nth-child(3) > div.counter.center > span').attr('data-to')
    const _odp_done = $('#content > div > div > section > div:nth-child(3) > div:nth-child(1) > div > div.sb-msg > div > div:nth-child(5) > div.counter.center > span').attr('data-to')
    const _odp_dead = $('#content > div > div > section > div:nth-child(3) > div:nth-child(1) > div > div.sb-msg > div > div:nth-child(7) > div.counter.center > span').attr('data-to')

    /**
     * PDP
     */
    const _pdp_total = $('#content > div > div > section > div:nth-child(3) > div:nth-child(2) > div > div.sb-msg > div:nth-child(1) > div.counter.center > span').attr('data-to')
    const _pdp_total_change = $('#content > div > div > section > div:nth-child(3) > div:nth-child(2) > div > div.sb-msg > div:nth-child(1) > div.counter.center > a').html().replace(/\(|\)/, '')
    const _pdp_process = $('#content > div > div > section > div:nth-child(3) > div:nth-child(2) > div > div.sb-msg > div:nth-child(3) > div.counter.center > span').attr('data-to')
    const _pdp_done = $('#content > div > div > section > div:nth-child(3) > div:nth-child(2) > div > div.sb-msg > div:nth-child(5) > div.counter.center > span').attr('data-to')
    const _pdp_dead = $('#content > div > div > section > div:nth-child(3) > div:nth-child(2) > div > div.sb-msg > div:nth-child(7) > div.counter.center > span').attr('data-to')

    /**
     * OTG
     */
    const _otg_total = $('#content > div > div > section > div:nth-child(3) > div:nth-child(3) > div > div.sb-msg > div:nth-child(1) > div.counter.center > span').attr('data-to')
    const _otg_total_change = $('#content > div > div > section > div:nth-child(3) > div:nth-child(3) > div > div.sb-msg > div:nth-child(1) > div.counter.center > a').html().replace(/\(|\)/, '')
    const _otg_process = $('#content > div > div > section > div:nth-child(3) > div:nth-child(3) > div > div.sb-msg > div:nth-child(3) > div.counter.center > span').attr('data-to')
    const _otg_done = $('#content > div > div > section > div:nth-child(3) > div:nth-child(3) > div > div.sb-msg > div:nth-child(5) > div.counter.center > span').attr('data-to')
    const _otg_dead = $('#content > div > div > section > div:nth-child(3) > div:nth-child(3) > div > div.sb-msg > div:nth-child(7) > div.counter.center > span').attr('data-to')

    const kecamatan = [
      'cigugur',
      'cijulang',
      'cimerak',
      'kalipucang',
      'langkaplancar',
      'mangunjaya',
      'padaherang',
      'pangandaran',
      'parigi',
      'sidamulih'
    ]

    let kecamatan_data = {}

    let i = 0
    let total_populasi = 0
    for (let k of kecamatan) {
      var population_kecamatan = parseInt($('#' + k + ' > .modal-lg > .modal-body > .modal-content > div.modal-body > div > div:nth-child(1) > div > div.sb-msg > table > tbody > tr:nth-child(2) > td:nth-child(2)').html().replace('.', ''));
      var positif_active = parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.danger').html());
      var positif_recover = parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.success').html());
      var positif_dead = parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.very-danger').html());

      ratio = Math.floor(population_kecamatan / (positif_active + positif_recover + positif_dead))

      if ((positif_active + positif_recover + positif_dead) == 0) {
        ratio = population_kecamatan;
      }

      kecamatan_data[k] = {
        odp_process: parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.info').html()),
        pdp_process: parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.warning').html()),
        otg_process: parseInt($('#datatable1 > tbody:nth-child(2) > tr:nth-child(' + (i + 1) + ') > td.active').html()),
        positif_active: positif_active,
        positif_recover: positif_recover,
        positif_dead: positif_dead,
        population: population_kecamatan,
        ratio: ratio.toLocaleString(),
        percentage: Math.round((positif_active + positif_recover + positif_dead) / (population_kecamatan + 0.0)).toFixed(3) + "%",
      }

      total_populasi += kecamatan_data[k].population

      i++
    }

    let beritas = []

    $$('#oc-posts').children().map((i, div) => {
      beritas.push({
        title: unescapeHTML($$(div).find('.entry-title > h3 > a').html().trim()),
        image: $$(div).find('.entry-image > img').attr('src'),
        link: $$(div).find('.entry-title > h3 > a').attr('href'),
        description: unescapeHTML($$(div).find('.entry-content').html().trim())
      })
    })

    data_recent = {
      slideshow: [
        {
          url: 'https://i.ibb.co/N2TJHQf/Untitled-1.png',
          to: null
        },
        {
          url: 'https://i.ibb.co/bBxdMQb/Covid2.png',
          to: 'https://covid19.pangandarankab.go.id/'
        }
      ],
      beritas: beritas,
      population: total_populasi,
      ratio: Math.floor(total_populasi / parseInt(_confirmed)).toLocaleString(),
      percentage: Math.round(parseInt(_confirmed) / (total_populasi + 0.0)).toFixed(3) + "%",
      /**
       * Confirmed
       */
      confirmed: {
        total: parseInt(_confirmed),
        active: parseInt(_confirmed_active),
        recover: parseInt(_confirmed_sembuh),
        dead: parseInt(_confirmed_dead),
        /**
         * Perubahan pada data di atas
         */
        __rechange__: {
          active: parseInt(_confirmed_active_change),
          recover: parseInt(_confirmed_sembuh_change),
          dead: parseInt(_confirmed_dead_change)
        }
      },
      odp: {
        total: parseInt(_odp_total),
        process: parseInt(_odp_process),
        done: parseInt(_odp_done),
        dead: parseInt(_odp_dead),
        __change__: {
          total: parseInt(_odp_total_change)
        },
        percentage: {
          process: Math.round((parseInt(_odp_process) / parseInt(_odp_total)) * 100).toFixed(2) + "%",
          done: Math.round((parseInt(_odp_done) / parseInt(_odp_total)) * 100).toFixed(2) + "%",
          dead: Math.round((parseInt(_odp_dead) / parseInt(_odp_total)) * 100).toFixed(2) + "%",
        }
      },
      pdp: {
        total: parseInt(_pdp_total),
        process: parseInt(_pdp_process),
        done: parseInt(_pdp_done),
        dead: parseInt(_pdp_dead),
        __change__: {
          total: parseInt(_pdp_total_change)
        },
        percentage: {
          process: Math.round((parseInt(_pdp_process) / parseInt(_pdp_total)) * 100).toFixed(2) + "%",
          done: Math.round((parseInt(_pdp_done) / parseInt(_pdp_total)) * 100).toFixed(2) + "%",
          dead: Math.round((parseInt(_pdp_dead) / parseInt(_pdp_total)) * 100).toFixed(2) + "%",
        }
      },
      otg: {
        total: parseInt(_otg_total),
        process: parseInt(_otg_process),
        done: parseInt(_otg_done),
        dead: parseInt(_otg_dead),
        __change__: {
          total: parseInt(_otg_total_change)
        },
        percentage: {
          process: Math.round((parseInt(_otg_process) / parseInt(_otg_total)) * 100).toFixed(2) + "%",
          done: Math.round((parseInt(_otg_done) / parseInt(_otg_total)) * 100).toFixed(2) + "%",
          dead: Math.round((parseInt(_otg_dead) / parseInt(_otg_total)) * 100).toFixed(2) + "%",
        }
      },
      kecamatan: kecamatan_data
    }

  } catch (e) {
    console.log(e)
    // Do nothing
  }

  return res.send({
    status: true
  })
})

/**
 * Listen to port
 */
app.listen(3000)