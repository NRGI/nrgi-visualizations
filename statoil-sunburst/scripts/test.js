// var chart = c3.generate({
//         data: {
//           json: [
//             {
//                 Country: 'Algeria',
//                 Taxes: 1568.1,
//                 Royalties: 0,
//                 Fees: 0.4,
//                 Bonuses: 0,
//                 entitlementsNOK: 3524.2
//             },
//             {
//                 Country: 'Angola',
//                 Taxes: 4870.9,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 18080.6
//             },
//             {
//                 Country: 'Australia',
//                 Taxes: 0,
//                 Royalties: 0,
//                 Fees: 2.6,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Azerbaijan',
//                 Taxes: 1288.6,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 8777.6
//             },
//             {
//                 Country: 'Brazil',
//                 Taxes: 49.9,
//                 Royalties: 865.2,
//                 Fees: 318,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Canada',
//                 Taxes: 1.9,
//                 Royalties: 768.2,
//                 Fees: 16.5,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Faroe Islands',
//                 Taxes: 0,
//                 Royalties: 0,
//                 Fees: 19.3,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Greenland',
//                 Taxes: 0,
//                 Royalties: 0,
//                 Fees: 0.1,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Indonesia',
//                 Taxes: 0.2,
//                 Royalties: 0,
//                 Fees: 1.9,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Iran',
//                 Taxes: 0.5,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Libya',
//                 Taxes: 277.6,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 314.2
//             },
//             {
//                 Country: 'Nigeria',
//                 Taxes: 2948,
//                 Royalties: 0,
//                 Fees: 360,
//                 Bonuses: 0,
//                 entitlementsNOK: 1873.4
//             },
//             {
//                 Country: 'Norway',
//                 Taxes: 89679.7,
//                 Royalties: 0,
//                 Fees: 648.8,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Russia',
//                 Taxes: 0,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 728.9
//             },
//             {
//                 Country: 'Sweden',
//                 Taxes: 16.1,
//                 Royalties: 0,
//                 Fees: 0,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'UK',
//                 Taxes: 87.1,
//                 Royalties: 0,
//                 Fees: 11.3,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'USA',
//                 Taxes: 245.6,
//                 Royalties: 585.5,
//                 Fees: 50.4,
//                 Bonuses: 75.7,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Other',
//                 Taxes: 0.2,
//                 Royalties: 0,
//                 Fees: 1.2,
//                 Bonuses: 0,
//                 entitlementsNOK: 0
//             },
//             {
//                 Country: 'Total',
//                 Taxes: 101034.5,
//                 Royalties: 2218.9,
//                 Fees: 1430.5,
//                 Bonuses: 75.7,
//                 entitlementsNOK: 33298.9
//             }
//           ],
//           keys: {
//             value: ['Taxes', 'Royalties', 'Fees', 'TotalUSD', 'Bonuses', 'entitlementsNOK']
//           },
//           type: 'bar',
//         },
//         axis: {
//             x: {
//                 type: 'category',
//                 categories: ['Algeria', 'Angola','Australia','Azerbaijan','Brazil','Canada','Faroe Islands','Greenland','Indonesia','Iran','Libya','Nigeria','Norway','Russia','Sweden','UK','USA','Other','Total']
//             }
//         },
//         bar: {
//           zerobased: false
//         }
//       });

var chart = c3.generate({
        data: {
          json: [
            {
                Country: 'Algeria',
                TotalNOK: 5092.8
            },
            {
                Country: 'Angola',
                TotalNOK: 22951.5
            },
            {
                Country: 'Australia',
                TotalNOK: 2.6
            },
            {
                Country: 'Azerbaijan',
                TotalNOK: 10066.2
            },
            {
                Country: 'Brazil',
                TotalNOK: 1233.1
            },
            {
                Country: 'Canada',
                TotalNOK: 786.7
            },
            {
                Country: 'Faroe Islands',
                TotalNOK: 19.3
            },
            {
                Country: 'Greenland',
                TotalNOK: 0.1
            },
            {
                Country: 'Indonesia',
                TotalNOK: 2.1
            },
            {
                Country: 'Iran',
                TotalNOK: 0.5
            },
            {
                Country: 'Libya',
                TotalNOK: 591.8
            },
            {
                Country: 'Nigeria',
                TotalNOK: 5181.4
            },
            {
                Country: 'Norway',
                TotalNOK: 90328.5
            },
            {
                Country: 'Russia',
                TotalNOK: 728.9
            },
            {
                Country: 'Sweden',
                TotalNOK: 16.1
            },
            {
                Country: 'UK',
                TotalNOK: 98.4
            },
            {
                Country: 'USA',
                TotalNOK: 957.2
            },
            {
                Country: 'Other',
                TotalNOK: 1.4
            },
            {
                Country: 'Total',
                TotalNOK: 138058.5
            }
          ],
          keys: {
            value: ['TotalNOK']
          },
          type: 'bar',
        },
        axis: {
            x: {
                type: 'category',
                categories: ['Algeria', 'Angola','Australia','Azerbaijan','Brazil','Canada','Faroe Islands','Greenland','Indonesia','Iran','Libya','Nigeria','Norway','Russia','Sweden','UK','USA','Other','Total']
            }
        },
        bar: {
          zerobased: false
        }
      });