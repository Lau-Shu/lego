import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';


// const COOKIES = "v_udt=cjNFdmFJemJYa3VpQVJQa1I5alFxYXU0bGR1NS0tQWFpNXlKSmRUcitUbUFFUy0tYTYrK0t0Q2EzSUZaL2JFRXQ2VktZZz09; anon_id=aabe2886-4c51-4705-a7a3-205a9d4a71a3; anonymous-locale=fr; cf_clearance=P9OAKZiYoN9Rgol8fPUeZxy7GeXFcGkpGLk.yM3FQdw-1775941647-1.2.1.1-edUaFRRquPAj6kQyE4lfnJuI7EMPXmzcAFp5nKwHyh1.xJZ6f.T6gg7lO9qmmyUR8mYQGsslQvBkmu9Sz8Vr6LQTAivWxPga56dL_9eQKQlwCx9286.r6WUd3U9BnPur.evCyMMwb58k0lBQI46aDzXoZY_zgpX1I3fJ8cAPxtNWVEA91xelqIAWPsny2DcFCEF4L9U9OPP4dl_JXw8hygPhO.JlGVLOvY5iYHorugS5_zWzHjOutNJjxVfLDkq43jTaMYvuq…Nm1Ia1UvRFUzSytsdklidVZtV0FvOXEzeFRzZURGL1RtejZxYks0azBYTjArSjdKeHdrQlJQRkYvNGtoRWhqUHlPRWlsd084RzgyaFhsbFRSQlRna25qTnp5MldZYjh1WWNwK2dxbUxlc1FRamo5UTVHVytJTlhxVTIxTVFGQy0tTlViSXEvZTIxV2xIa0pTa1NtNDZKUT09--020f80ef2891be13adcde4f314599311883eed4d; consent_version=eu; domain_selected=true; __eoi=ID=3cf3fe10af14ca38:T=1775941662:RT=1775942290:S=AA-AfjYbjocyBJ1UcW6K5apXLOaI; monetixads-user-session=25010064641490201001011490513864153624; sharedid=408d4a4d-3f67-4e2a-baf5-289f2ecc7885; sharedid_cst=glM0aA%3D%3D"
const COOKIES = "v_udt=Z1RXOTE1MW5BcjZLSVBFdG9NRFJrUXFPOHZWWS0tWWpKOERGWnl5SXJxb21NRi0tbWNFWjg0TVZxdEtlRkhqam83bExiQT09; anon_id=621e8491-5f46-4057-8020-e05875be8295; anonymous-locale=fr; non_dot_com_www_domain_cookie_buster=1; anonymous-iso-locale=fr-FR; v_sid=2ef5ca5dca9b1a0bd6aa3da9bccf4cf2; consent_version=eu; domain_selected=true; is_shipping_fees_applied_info_banner_dismissed=false; v_sid=7f974697-1775768168; OptanonAlertBoxClosed=2026-04-11T21:21:52.755Z; eupubconsent-v2=CQifnzAQifnzAAcABBFRCaFgAAAAAEPgAAwIAAAWZABMNDogjLIgECBQEAIEACgrCACgQBAAAkDRAQAmDAhyBgAusJkAIAUAAwQAgABBgACAAASABCIAIACAQAgQCBQABgAQBAQAMDAAGACxEAgABAdAxTAggECwASIyqDTAlAASCAlsqEEgCBBXCFIscAggREwUAAAIABQAAAD4WAhJKCViQQBcQXQAIEAAAUQIECKQswBBQGaLQVgScBkaYBk-YJklOgyAJghIyDIhNUEg8UxRAAAA.YAAACHwAAAAA.ILNtR_G__bXlv-Tb36bpkeYxf99hr7sQxBgbJs24FzLvW7JwC32E7NEzatqYKmRIAu3TBIQNtHIjURUChKIgVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4pjWQCZ4ur_51d9mT-N7dr-2dzyy5hnv3a9fuS1UJicKYetHfn8ZBKT-_IU9_x-_4v4_MbpEm-eS1v_tGtt43d64tP_dpuxt-Tyffz___f72_e7X__c__33_-qXX_77_4A; OTAdditionalConsentString=2~~dv.20.43.55.57.61.70.83.89.93.108.117.122.124.135.143.144.147.149.159.161.184.192.196.211.228.230.236.239.255.259.266.272.286.291.311.313.314.320.322.323.327.358.367.370.371.385.407.415.424.429.430.436.445.469.486.491.494.495.522.523.540.550.560.568.574.576.584.587.591.621.723.737.797.798.803.820.827.839.864.899.904.922.938.955.959.979.981.985.986.1003.1027.1031.1033.1046.1047.1048.1051.1053.1067.1092.1095.1097.1099.1107.1109.1126.1135.1143.1149.1152.1162.1166.1186.1188.1192.1205.1215.1220.1226.1227.1230.1252.1268.1270.1276.1284.1290.1301.1307.1312.1329.1342.1345.1356.1365.1403.1415.1416.1419.1421.1423.1440.1449.1455.1495.1512.1514.1516.1525.1540.1548.1555.1558.1570.1577.1579.1583.1584.1598.1603.1616.1638.1651.1653.1659.1660.1667.1677.1678.1682.1697.1699.1703.1712.1716.1720.1721.1725.1732.1735.1745.1750.1753.1765.1782.1786.1800.1808.1810.1825.1827.1832.1838.1840.1843.1845.1859.1870.1878.1880.1882.1889.1898.1911.1917.1928.1929.1942.1944.1958.1962.1963.1964.1967.1968.1969.1978.1985.1987.2003.2027.2035.2038.2039.2044.2047.2052.2056.2064.2068.2069.2072.2074.2084.2088.2090.2103.2107.2109.2115.2124.2130.2133.2135.2137.2140.2141.2147.2156.2166.2177.2186.2205.2213.2216.2219.2220.2222.2223.2224.2225.2227.2234.2251.2253.2271.2275.2279.2282.2295.2299.2309.2310.2312.2316.2322.2325.2328.2331.2335.2336.2343.2354.2358.2359.2370.2373.2376.2377.2400.2403.2405.2406.2407.2410.2411.2414.2415.2416.2418.2425.2427.2440.2447.2453.2461.2465.2468.2472.2477.2484.2486.2488.2498.2506.2510.2517.2526.2527.2531.2532.2534.2535.2542.2552.2559.2563.2564.2567.2568.2569.2571.2572.2575.2577.2579.2583.2584.2589.2595.2596.2604.2605.2608.2609.2610.2612.2614.2621.2624.2627.2628.2629.2633.2636.2642.2643.2645.2646.2650.2651.2652.2656.2657.2658.2660.2661.2669.2670.2677.2681.2684.2686.2687.2689.2690.2695.2698.2713.2714.2729.2739.2767.2768.2770.2772.2778.2784.2787.2791.2792.2798.2801.2805.2812.2813.2814.2816.2817.2821.2822.2824.2827.2830.2831.2832.2833.2834.2838.2839.2844.2846.2849.2850.2852.2854.2860.2862.2863.2865.2867.2869.2872.2874.2875.2878.2880.2881.2882.2884.2886.2887.2888.2889.2891.2893.2894.2895.2897.2898.2900.2901.2908.2909.2916.2917.2918.2920.2922.2923.2927.2929.2930.2931.2940.2941.2947.2949.2950.2956.2958.2961.2963.2964.2965.2966.2968.2970.2972.2973.2974.2975.2979.2980.2981.2983.2985.2986.2987.2994.2995.2997.2999.3000.3001.3002.3003.3005.3008.3009.3010.3012.3016.3017.3018.3019.3023.3028.3031.3034.3038.3043.3051.3052.3053.3055.3058.3059.3063.3066.3068.3070.3073.3074.3075.3076.3077.3088.3089.3090.3093.3094.3095.3097.3099.3100.3106.3107.3109.3112.3117.3119.3126.3127.3128.3130.3133.3135.3136.3137.3145.3149.3150.3151.3153.3155.3163.3165.3167.3169.3172.3173.3177.3182.3183.3184.3185.3186.3187.3188.3189.3190.3194.3196.3200.3201.3209.3210.3211.3213.3214.3215.3217.3218.3222.3223.3225.3226.3227.3228.3230.3231.3233.3234.3235.3236.3237.3238.3240.3244.3245.3250.3251.3253.3254.3257.3260.3266.3270.3272.3281.3286.3288.3289.3290.3292.3293.3296.3299.3300.3306.3307.3309.3314.3315.3316.3318.3323.3324.3328.3330.3331.3531.3631.3731.3831.4131.4331.4531.4631.4731.4831.5231.6931.7131.7235.7831.7931.8931.9731.10231.10631.10831.11031.11531.11631.13431.13632.14034.14133.14237.14332.15731.16831.16931.21233.21731.23031.25131.25931.26031.26631.26831.27731.27831.28031.28332.28731.28831.29631.30331.30532.30732.32531.33931.34231.34631.34731.36831.39131.39531.40632.41131.41531.43631.43731.43831.45931.47031.47232.47531.48131.49231.49332.49431.50831.52831.54231.56831.56931.57131.57231.57531; monetixads-user-session=25010064645373614600053736146000513864153632; sharedid=dffbf991-b65f-404d-b435-6caae0c3ab0d; sharedid_cst=KRTN%2Fw%3D%3D; cf_clearance=NW1QLOC_a8UQjB9XViqlhhLkCeb8zFEgllgdBEJNklI-1775996572-1.2.1.1-vICANSbidzVwsiy79ly3VeYAVDLtqeXsafbeGB94gjUk8ZrnLq_OjCpl.hCMtbBTjtyO26F1d4n8zilECMKq1VTlsQUCklliLEwPInnfZ3p1sjs_91p3QVEF6ZhV2ZeTR59TszBPMQ4Fgx1R86k2BHc6xN4twRI.Ql1nmCnznaTEDuwXCGUbmv9PWNgj6lg8B8Z8yMrzxZ8PI1ofLEP5Awb8N15qD.JB4aA4cblTwbx.3Yh2_2vNmqU0H3E69sYHHdUq6i4N1hEZfzmRHqkJ64T8jCa_6nfZtDFvHbtkJoY0j48ECaB.xsav_yJbqTXYvAjnLmyKbIpHlal_piwTWA; __cf_bm=7RwNe2bhKLBR0Z2vxACVeuzP74FoA5fHGCeTkg09ikE-1775996572.2410364-1.0.1.1-FfCO5szuhCmIu0gqMD2zeMF2I3Qk1ZFibv_91Bj8i9P10x52ked2Ujq40RTCtkjf0owXQEm5hzsRKomXXYnPTbXFEZtnN1rj9ztT1EKfaM9_dVJbUOfxuI_xlO7hok4xeXoUEqSYksWPTpbOE8eFsw; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc2NjAxMzczLCJpYXQiOjE3NzU5OTY1NzMsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJyZWZyZXNoIiwic2NvcGUiOiJwdWJsaWMiLCJzaWQiOiI3Zjk3NDY5Ny0xNzc1NzY4MTY4In0.b21QCYeolkypQmLEIQ4o67wKeG6_codJvqnhDQIXDzmAGnQ_2XnBq_wbsw69O21JjjasYHzzXPpn0cVas3GzsB7j1-poWRwJ9OC8-aeG2Jg1w4_8h6pN4kUKI1p_LoDxkkDBpnjGWrRrEDMWlgwnuvmgtem4vlgYw-aq_udlGVf8g36iFM3JAjwXEtw-ir9cUIP-CC2hUDfYAdVo1HbrNCH1LB-8gxTDbRQ7dgyec2dcJPslOIQ_qdjgAmiENzQeuCLZVhvR66LSv4StZ7vfPII2qgq2MOZfvmJhNG-mqo5s0DBxaXECT-J6rsOkQmqnTSC1kV-O7kCufXaHWpTKdQ; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzc2MDAzNzczLCJpYXQiOjE3NzU5OTY1NzMsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJhY2Nlc3MiLCJzY29wZSI6InB1YmxpYyIsInNpZCI6IjdmOTc0Njk3LTE3NzU3NjgxNjgifQ.OMW-q-d91Scln_GIYQnkuu8aGyZhjDLQXIRsqvHSWpDrZhhUJuZyhxqd_P1-tG0Gji5MfJUctft9G5xBL3jEBEu4_CL8gukJZ7zEc4merqJzMq5sVqPAyPrC9hvj01a9M7scyVHJp2Stzra5Oig5gGlqrKo1fdrCtLKDQBvPlNBobQf1E0ln02vypq0v56x_wqdC-39EnnGH-0I1o8xdSpp_7e2NO6jAv2G1JJxy1MhLxmvHO29ViL0GhMkzBdDZRWYcPcfWY1sr9qjBHUKRb2FftJfD_2WC2xUtU01q0jTZ3kc1DoqLxJTrg9LEyi2x2WrfAM0NiCnkg7meIUVcIg; banners_ui_state=SUCCESS; _vinted_fr_session=clk4dVNvTFN6c0RjcFJZM1BrQmUySVBLd2x6RlNuaTFYUjJQSzMyTkV4WXo1UzZYSnpIdlpmU1lTUGx6Z0FRMGNLV2tqZ2Mxb0RLS0xGSEVmb2FMdEJuSHpscEJWanNVT0tQTktBSXNHL2lNb3lnSW0wN0R1NjB3a0pyMmcxcU9JMmR6ZVlGQXdlZlRDc0V0Y3p1WmlFb2VuUnc5Q0ZBYS9WbnhXeTN1S21mV3NYcjJHMXB4SzZmSk5aYTF2L0h2OGZiSm8yWEFTZ3BMRXk4Z2VveXU3UjhQZjRYSWE4L3pFZ1JPQmhPdzV0dz0tLW9mc29YUDlXSm9NdzVFUDdwdkM1MHc9PQ%3D%3D--3f428e2d0b60d4c310856f19e541067f6dc6740a; OptanonConsent=isGpcEnabled=0&datestamp=Sun+Apr+12+2026+14%3A23%3A04+GMT%2B0200+(heure+d%E2%80%99%C3%A9t%C3%A9+d%E2%80%99Europe+centrale)&version=202602.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=621e8491-5f46-4057-8020-e05875be8295&isAnonUser=1&hosts=&interactionCount=2&prevHadToken=0&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0035%3A0%2CC0038%3A0&genVendors=V5%3A0%2CV2%3A0%2CV1%3A0%2C&crTime=1775942512958&AwaitingReconsent=false&intType=2&geolocation=FR%3BIDF; datadome=ubB7uAArzfplaVuU~dngvzxcSdf18CRwCGUCGRRiegV4AERfJgCy8xFP83IUmKszKibtPARCuA8_QvENzUXAbaJ0Y_ZKSYYn8sN0hySU3D0d_wSu0VYgyGDFQdHJgRYN; __eoi=ID=8ab89a1f675f5197:T=1775942543:RT=1775996586:S=AA-AfjbX93X_HUqyf3vZz81froma; viewport_size=830"
//network, vinted.fr, cookie dans header et copier coller + préciser un id dans le cmd
function isNotDefined(value) {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}

// On ne scrape pas avec les éléments CSS ici, c'est une autre manière de scrap de la donnée
// Une api existe déjà pour vinted, on peut faire du scraping de l'api plutôt que du html, c'est plus rapide et plus fiable

/**
 * Parse  
 * @param  {String} data - json response
 * @return {Object} sales
 */
const parse = data => {
  try {
    const {items} = data;

    return items.map(item => {
      const link = item.url;
      const price = item.total_item_price;
      const published = item.photo?.high_resolution?.timestamp || null;

      return {
        link,
        price,
        title: item.title,
        published,
        'uuid': uuidv5(link, uuidv5.URL)
      }
    })
  } catch (error){
    console.error(error);
    return [];
  }
}



const scrape = async searchText => {

  console.log("SCRAPE INPUT =", searchText);

  try {

    if (isNotDefined(COOKIES)) {
      throw "vinted requires a valid cookie";
    }
    

    const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1727382549&search_text=${encodeURIComponent(searchText)}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids`, {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "cookie": COOKIES
      },
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET"
    });

    if (response.ok) {
      const body = await response.json();

      return parse(body);
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};


export {scrape};