(function () {
   'use strict';

   const MOUNTAIN_PALETTE = {
      distant: {
         gradient: {
            id: 'mtn-distant-grad',
            stops: [{
                  offset: '0%',
                  color: '#1a2840'
               },
               {
                  offset: '30%',
                  color: '#162235'
               },
               {
                  offset: '60%',
                  color: '#121c2c'
               },
               {
                  offset: '100%',
                  color: '#0e1824'
               }
            ]
         },
         shadowGradient: {
            id: 'mtn-distant-shadow',
            stops: [{
                  offset: '0%',
                  color: '#0e1820'
               },
               {
                  offset: '100%',
                  color: '#0a1218'
               }
            ]
         }
      },
      mid: {
         gradient: {
            id: 'mtn-mid-grad',
            stops: [{
                  offset: '0%',
                  color: '#121e30'
               },
               {
                  offset: '35%',
                  color: '#0e1828'
               },
               {
                  offset: '70%',
                  color: '#0a1420'
               },
               {
                  offset: '100%',
                  color: '#081018'
               }
            ]
         },
         shadowGradient: {
            id: 'mtn-mid-shadow',
            stops: [{
                  offset: '0%',
                  color: '#0a1218'
               },
               {
                  offset: '100%',
                  color: '#060c12'
               }
            ]
         },
         highlightGradient: {
            id: 'mtn-mid-highlight',
            stops: [{
                  offset: '0%',
                  color: '#2a4868'
               },
               {
                  offset: '100%',
                  color: '#1a3050'
               }
            ]
         }
      },
      foreground: {
         gradient: {
            id: 'mtn-near-grad',
            stops: [{
                  offset: '0%',
                  color: '#0c1a28'
               },
               {
                  offset: '40%',
                  color: '#081420'
               },
               {
                  offset: '100%',
                  color: '#040c14'
               }
            ]
         },
         shadowGradient: {
            id: 'mtn-near-shadow',
            stops: [{
                  offset: '0%',
                  color: '#060e18'
               },
               {
                  offset: '100%',
                  color: '#02080f'
               }
            ]
         },
         highlightGradient: {
            id: 'mtn-near-highlight',
            stops: [{
                  offset: '0%',
                  color: '#1e3c58'
               },
               {
                  offset: '100%',
                  color: '#0e2238'
               }
            ]
         }
      },
      close: {
         gradient: {
            id: 'mtn-close-grad',
            stops: [{
                  offset: '0%',
                  color: '#070f18'
               },
               {
                  offset: '50%',
                  color: '#04090f'
               },
               {
                  offset: '100%',
                  color: '#020508'
               }
            ]
         }
      }
   };

   const MOUNTAINS = {
      distant: {
         classList: 'mountain-layer mountain-distant',
         viewBox: '0 0 1440 600',
         path: 'M-10,600 L-10,420 L 30,420 L 60,380 L 90,395 L 130,350 L 170,370 L 210,320 L 250,345 L 290,380 L 330,380 L 370,340 L 410,290 L 445,310 L 480,270 L 520,295 L 560,250 L 600,275 L 640,310 L 680,350 L 720,380 L 760,380 L 800,340 L 840,290 L 875,310 L 910,270 L 950,290 L 990,330 L 1030,370 L 1070,380 L 1110,380 L 1150,340 L 1190,295 L 1220,315 L 1260,280 L 1300,300 L 1340,340 L 1380,370 L 1420,350 L 1450,360 L 1450,600 Z',
         shadowPaths: [
            'M 130,350 L 170,370 L 210,320 L 230,340 L 200,360 L 160,365 Z',
            'M 410,290 L 445,310 L 480,270 L 500,285 L 470,305 L 430,300 Z',
            'M 560,250 L 600,275 L 640,310 L 610,300 L 580,275 L 560,250 Z',
            'M 840,290 L 875,310 L 910,270 L 930,285 L 900,305 L 860,300 Z',
            'M 1260,280 L 1300,300 L 1340,340 L 1310,320 L 1280,295 Z'
         ],
         highlightPaths: [
            'M 170,370 L 210,320 L 250,345 L 230,350 L 200,335 L 175,368 Z',
            'M 445,310 L 480,270 L 520,295 L 495,295 L 465,285 L 450,305 Z',
            'M 520,295 L 560,250 L 600,275 L 570,268 L 540,280 L 525,295 Z',
            'M 910,270 L 950,290 L 990,330 L 960,315 L 930,290 L 915,278 Z',
            'M 1220,315 L 1260,280 L 1300,300 L 1270,295 L 1240,305 Z'
         ]
      },
      mid: {
         classList: 'mountain-layer mountain-mid',
         viewBox: '0 0 1440 600',
         path: 'M-10,600 L-10,450 L 30,450 L 60,420 L 90,435 L 130,390 L 170,408 L 210,365 L 250,385 L 290,420 L 330,450 L 370,450 L 410,410 L 450,360 L 490,378 L 530,340 L 570,360 L 610,390 L 650,420 L 690,450 L 730,450 L 770,410 L 810,365 L 850,385 L 890,350 L 930,370 L 970,400 L 1010,430 L 1050,450 L 1090,450 L 1130,415 L 1170,370 L 1210,388 L 1250,355 L 1290,375 L 1330,405 L 1370,430 L 1410,415 L 1450,420 L 1450,600 Z',
         shadowPaths: [
            'M 130,390 L 170,408 L 210,365 L 220,378 L 185,400 L 145,395 Z',
            'M 450,360 L 490,378 L 530,340 L 545,352 L 505,375 L 465,370 Z',
            'M 810,365 L 850,385 L 890,350 L 905,362 L 865,385 L 825,378 Z',
            'M 1170,370 L 1210,388 L 1250,355 L 1265,367 L 1225,388 L 1185,382 Z'
         ],
         highlightPaths: [
            'M 170,408 L 210,365 L 250,385 L 235,392 L 205,375 L 180,405 Z',
            'M 490,378 L 530,340 L 570,360 L 550,365 L 520,350 L 500,375 Z',
            'M 850,385 L 890,350 L 930,370 L 910,375 L 880,360 L 860,382 Z',
            'M 1210,388 L 1250,355 L 1290,375 L 1270,380 L 1240,365 L 1220,385 Z'
         ],
         forestLine: 'M-10,480 L 60,465 L 170,450 L 290,470 L 410,455 L 530,440 L 650,460 L 770,455 L 890,445 L 1010,465 L 1130,455 L 1250,440 L 1370,460 L 1450,450'
      },
      foreground: {
         classList: 'mountain-layer mountain-foreground',
         viewBox: '0 0 1440 600',
         path: 'M-10,600 L-10,500 L 25,500 L 50,480 L 80,490 L 120,455 L 160,468 L 200,440 L 240,455 L 280,480 L 320,500 L 360,500 L 400,475 L 440,445 L 480,458 L 520,425 L 560,442 L 600,465 L 640,485 L 680,500 L 720,500 L 760,475 L 800,440 L 840,455 L 880,425 L 920,442 L 960,468 L 1000,490 L 1040,500 L 1080,500 L 1120,475 L 1160,445 L 1200,458 L 1240,430 L 1280,448 L 1320,470 L 1360,488 L 1400,475 L 1450,480 L 1450,600 Z',
         shadowPaths: [
            'M 120,455 L 160,468 L 200,440 L 215,452 L 175,472 L 135,468 Z',
            'M 440,445 L 480,458 L 520,425 L 535,438 L 495,460 L 455,455 Z',
            'M 800,440 L 840,455 L 880,425 L 895,438 L 855,460 L 815,452 Z',
            'M 1160,445 L 1200,458 L 1240,430 L 1255,442 L 1215,462 L 1175,455 Z'
         ],
         highlightPaths: [
            'M 160,468 L 200,440 L 240,455 L 224,462 L 195,448 L 172,468 Z',
            'M 480,458 L 520,425 L 560,442 L 542,448 L 515,435 L 492,458 Z',
            'M 840,455 L 880,425 L 920,442 L 902,448 L 875,435 L 852,455 Z',
            'M 1200,458 L 1240,430 L 1280,448 L 1262,455 L 1235,442 L 1212,458 Z'
         ],
         forestLine: 'M-10,530 L 50,520 L 160,508 L 280,520 L 400,510 L 520,500 L 640,515 L 760,512 L 880,505 L 1000,518 L 1120,510 L 1240,502 L 1360,515 L 1450,510'
      },
      close: {
         classList: 'mountain-layer mountain-close',
         viewBox: '0 0 1440 600',
         path: 'M-10,600 L-10,540 L 20,540 L 40,528 L 65,538 L 95,540 L 115,522 L 140,535 L 170,540 L 195,525 L 220,538 L 250,540 L 275,518 L 300,532 L 330,540 L 355,522 L 380,535 L 410,540 L 435,518 L 460,532 L 490,540 L 515,522 L 540,535 L 570,540 L 595,520 L 620,532 L 650,540 L 675,518 L 700,530 L 730,540 L 755,522 L 780,534 L 810,540 L 835,518 L 860,530 L 890,540 L 915,520 L 940,532 L 970,540 L 995,518 L 1020,530 L 1050,540 L 1075,520 L 1100,532 L 1130,540 L 1155,518 L 1180,530 L 1210,540 L 1235,522 L 1260,534 L 1290,540 L 1315,520 L 1340,532 L 1370,540 L 1395,525 L 1420,536 L 1450,530 L 1450,600 Z',
         forestDetail: 'M-10,560 L 65,555 L 170,548 L 275,558 L 380,550 L 490,545 L 595,555 L 700,550 L 810,548 L 915,555 L 1020,550 L 1130,548 L 1235,552 L 1340,550 L 1450,555'
      }
   };

   const CLOUDS = {
      viewBox: '0 0 1440 280',
      clouds: [{
            classList: 'cloud cloud-1',
            filter: 'cloud-soft',
            path: 'M 80,120 C 72,108 78,95 90,92 C 88,78 96,66 110,64 C 114,52 126,44 140,48 C 148,38 162,40 168,50 C 176,44 190,48 192,60 C 204,58 212,70 206,82 C 216,86 216,100 205,105 L 85,110 C 70,108 74,117 80,120 Z',
            fill: 'rgba(255,255,255,0.78)'
         },
         {
            classList: 'cloud cloud-2',
            filter: 'cloud-soft',
            path: 'M 760,95 C 754,85 760,75 772,72 C 770,62 778,52 790,54 C 794,44 806,40 818,46 C 824,38 838,40 844,50 C 855,48 862,58 858,70 C 868,72 870,88 860,95 L 768,98 C 754,96 758,90 760,95 Z',
            fill: 'rgba(255,255,255,0.68)'
         },
         {
            classList: 'cloud cloud-3',
            filter: 'cloud-soft-sm',
            path: 'M 380,110 C 376,102 382,94 392,92 C 394,82 402,76 414,78 C 418,70 430,68 440,74 C 446,68 458,72 460,82 C 470,82 478,92 472,102 C 482,106 480,118 470,122 L 388,120 C 378,118 382,112 380,110 Z',
            fill: 'rgba(255,255,255,0.58)'
         },
         {
            classList: 'cloud cloud-4',
            filter: 'cloud-soft',
            path: 'M 1080,88 C 1074,78 1082,68 1094,66 C 1092,56 1100,46 1114,48 C 1118,38 1134,35 1150,42 C 1158,34 1174,38 1180,50 C 1192,48 1202,60 1196,72 C 1208,76 1210,92 1198,98 L 1092,100 C 1078,98 1082,90 1080,88 Z',
            fill: 'rgba(255,255,255,0.62)'
         },
         {
            classList: 'cloud cloud-5',
            filter: 'cloud-soft-sm',
            path: 'M 1280,132 C 1278,125 1284,118 1292,118 C 1294,110 1302,105 1312,108 C 1316,102 1328,100 1336,106 C 1342,100 1354,104 1356,112 C 1366,112 1372,122 1366,130 C 1374,134 1372,146 1362,148 L 1288,146 C 1280,144 1282,138 1280,132 Z',
            fill: 'rgba(255,255,255,0.48)'
         }
      ]
   };

   function createSVG(attrs) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      Object.entries(attrs).forEach(([k, v]) => svg.setAttribute(k, v));
      return svg;
   }

   function createDefs(gradients) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      gradients.forEach(gradient => {
         if (!gradient) return;
         const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
         grad.setAttribute('id', gradient.id);
         grad.setAttribute('x1', '0%');
         grad.setAttribute('y1', '0%');
         grad.setAttribute('x2', '0%');
         grad.setAttribute('y2', '100%');
         gradient.stops.forEach(stop => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            el.setAttribute('offset', stop.offset);
            el.setAttribute('style', `stop-color:${stop.color}`);
            grad.appendChild(el);
         });
         defs.appendChild(grad);
      });
      return defs;
   }

   function createPath(d, fill, extra = {}) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', fill);
      Object.entries(extra).forEach(([k, v]) => path.setAttribute(k, v));
      return path;
   }

   function generateDistantMountains() {
      const data = MOUNTAINS.distant;
      const pal = MOUNTAIN_PALETTE.distant;
      const svg = createSVG({
         class: data.classList,
         viewBox: data.viewBox,
         preserveAspectRatio: 'none'
      });
      svg.appendChild(createDefs([pal.gradient, pal.shadowGradient]));
      svg.appendChild(createPath(data.path, `url(#${pal.gradient.id})`));
      data.shadowPaths.forEach(p => svg.appendChild(createPath(p, `url(#${pal.shadowGradient.id})`, {
         opacity: '0.4'
      })));
      data.highlightPaths.forEach(p => svg.appendChild(createPath(p, 'rgba(100,170,230,0.18)', {
         opacity: '0.5'
      })));
      return svg;
   }

   function generateMidMountains() {
      const data = MOUNTAINS.mid;
      const pal = MOUNTAIN_PALETTE.mid;
      const svg = createSVG({
         class: data.classList,
         viewBox: data.viewBox,
         preserveAspectRatio: 'none'
      });
      svg.appendChild(createDefs([pal.gradient, pal.shadowGradient, pal.highlightGradient]));
      svg.appendChild(createPath(data.path, `url(#${pal.gradient.id})`));
      data.shadowPaths.forEach(p => svg.appendChild(createPath(p, `url(#${pal.shadowGradient.id})`, {
         opacity: '0.45'
      })));
      data.highlightPaths.forEach(p => svg.appendChild(createPath(p, `url(#${pal.highlightGradient.id})`, {
         opacity: '0.5'
      })));
      svg.appendChild(createPath(data.forestLine, 'none', {
         stroke: 'rgba(2,6,10,0.8)',
         'stroke-width': '10',
         'stroke-linecap': 'round',
         opacity: '0.55'
      }));
      return svg;
   }

   function generateForegroundMountains() {
      const data = MOUNTAINS.foreground;
      const pal = MOUNTAIN_PALETTE.foreground;
      const svg = createSVG({
         class: data.classList,
         viewBox: data.viewBox,
         preserveAspectRatio: 'none'
      });
      svg.appendChild(createDefs([pal.gradient, pal.shadowGradient, pal.highlightGradient]));
      svg.appendChild(createPath(data.path, `url(#${pal.gradient.id})`));
      data.shadowPaths.forEach(p => svg.appendChild(createPath(p, `url(#${pal.shadowGradient.id})`, {
         opacity: '0.5'
      })));
      data.highlightPaths.forEach(p => svg.appendChild(createPath(p, `url(#${pal.highlightGradient.id})`, {
         opacity: '0.5'
      })));
      svg.appendChild(createPath(data.forestLine, 'none', {
         stroke: 'rgba(1,4,8,0.9)',
         'stroke-width': '14',
         'stroke-linecap': 'round',
         opacity: '0.65'
      }));
      return svg;
   }

   function generateCloseMountains() {
      const data = MOUNTAINS.close;
      const pal = MOUNTAIN_PALETTE.close;
      const svg = createSVG({
         class: data.classList,
         viewBox: data.viewBox,
         preserveAspectRatio: 'none'
      });
      svg.appendChild(createDefs([pal.gradient]));
      svg.appendChild(createPath(data.path, `url(#${pal.gradient.id})`));
      svg.appendChild(createPath(data.forestDetail, 'none', {
         stroke: 'rgba(0,2,5,1)',
         'stroke-width': '22',
         'stroke-linecap': 'round',
         opacity: '1'
      }));
      return svg;
   }

   function generateClouds() {
      const svg = createSVG({
         class: 'clouds-svg',
         viewBox: CLOUDS.viewBox,
         preserveAspectRatio: 'xMidYMid slice'
      });
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      [{
         id: 'cloud-soft',
         stdDeviation: '5'
      }, {
         id: 'cloud-soft-sm',
         stdDeviation: '3'
      }].forEach(f => {
         const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
         filter.setAttribute('id', f.id);
         filter.setAttribute('x', '-20%');
         filter.setAttribute('y', '-20%');
         filter.setAttribute('width', '140%');
         filter.setAttribute('height', '140%');
         const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
         blur.setAttribute('stdDeviation', f.stdDeviation);
         filter.appendChild(blur);
         defs.appendChild(filter);
      });
      svg.appendChild(defs);
      CLOUDS.clouds.forEach(cloud => {
         const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
         g.setAttribute('class', cloud.classList);
         g.setAttribute('filter', `url(#${cloud.filter})`);
         g.appendChild(createPath(cloud.path, cloud.fill));
         svg.appendChild(g);
      });
      return svg;
   }

   function init() {
      const mountainsContainer = document.querySelector('.mountains-container');
      const cloudsContainer = document.querySelector('.clouds-container');
      if (mountainsContainer) {
         mountainsContainer.innerHTML = '';
         mountainsContainer.appendChild(generateDistantMountains());
         mountainsContainer.appendChild(generateMidMountains());
         mountainsContainer.appendChild(generateForegroundMountains());
         mountainsContainer.appendChild(generateCloseMountains());
      }
      if (cloudsContainer) {
         cloudsContainer.innerHTML = '';
         cloudsContainer.appendChild(generateClouds());
      }
   }

   if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
   } else {
      init();
   }

})();