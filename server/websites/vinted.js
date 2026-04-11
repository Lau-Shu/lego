import * as cheerio from 'cheerio';
import { v5 as uuidv5 } from 'uuid';

const COOKIES = "v_udt=ck9jUWRQWno5NmY3V3paenlET2VNZnJrVC96Ty0tMFlmNGRmbVk4K3BRdUVrUC0tdHpOMzNjaHAveCs1VEZqb2ZwTFdQQT09; anon_id=e72c5c3b-6928-42d7-b231-3e0585b55c21; anonymous-locale=fr; non_dot_com_www_domain_cookie_buster=1; refresh_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzczNzcwMTYyLCJpYXQiOjE3NzMxNjUzNjIsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJyZWZyZXNoIiwic2NvcGUiOiJwdWJsaWMiLCJzaWQiOiJiZWJiYjJhMS0xNzczMTY1MzYyIn0.c72enxB_1y8zwGOakuSAQdtcO82KUWZQQ-WyfuqdGsBkq9RyHUGoPsNO9e13PuNXIQYuVIR_Ym1eeIZrE3iYprgAcN9Ky3deUBgadUQ04nTpsJchecZWa6_hythfMkArx98uNmDVfLxSz2Au24yTvXhddqwU7_lnOBX6mWWRgfVwuluYyYZOk6TsyOKBkS01mvK78Dkhd5jLpLWV3kCbgG2zEdkf03mO-KN5i9uY7PBTp5YVxsArE3R4NEC-NhNlBck5TYTXhCDYWA_P7Fu7f4QcH3yr6XnbtVpyfaI-5O2YS-mx0yy5k9TVVveR5heJ2_u-C9043d-EYlFwy4RTbQ; access_token_web=eyJraWQiOiJFNTdZZHJ1SHBsQWp1MmNObzFEb3JIM2oyN0J1NS1zX09QNVB3UGlobjVNIiwiYWxnIjoiUFMyNTYifQ.eyJhcHBfaWQiOjQsImF1ZCI6ImZyLmNvcmUuYXBpIiwiY2xpZW50X2lkIjoid2ViIiwiZXhwIjoxNzczMTcyNTYyLCJpYXQiOjE3NzMxNjUzNjIsImlzcyI6InZpbnRlZC1pYW0tc2VydmljZSIsInB1cnBvc2UiOiJhY2Nlc3MiLCJzY29wZSI6InB1YmxpYyIsInNpZCI6ImJlYmJiMmExLTE3NzMxNjUzNjIifQ.P3aG_bC32kfrKLVx15EAlsPu2p7iR2NdtzPm6sNUA7TEwJDBc9Cm80bgJ3NrkkNQHpgY986S83icXcNUqe2NvVgAd4DuH-u-7ehFeEYXM-wFXQ1kLOZKacJOemO8aLtgpk-Yyh4RjwLLNpS8rSP0raVK65Oin86L0VvZ5TTsxbtTxkTnfBQV2Nb3SaKHMTqJ7YlzVV6MyAsYf0V_LpWaPfzEnVXO1kG448kP4CPyx_SGL7_rGZ42hBtgQCAbTwpwmqIDQeuXM_-Yb6myzjS58TLHKc9CGb61ThcbhjQRkXs02F6PrJVdp07AIVaa2tvZzPFV6vGw5A_GDGQN4HwzHQ; __cf_bm=Fvk5FsY3s_IXG.yJf6Fn5sN2z951UF0VVy.Gwz4zO1U-1773165365-1.0.1.1-uy3JDN5d5ZeJ4wKDWUFhW2yxdlSHpJW7xr7NjIYYDIx2jCbUfrtb462NSX9NLW6zclOmXtm9.7DDN.dy1eI.21Sx4fVmn.AMv4jEgJ0bHnPYw42L93ed8iw3CDizxftW; cf_clearance=ytIwy_16fGobOr_rA4Ke477u0AGHMufLhAeueBiQFm4-1773165366-1.2.1.1-5r26NYnwQvIv5lvvndZxDOmFkXqcI5jx7lIjkTwoyIhUtQarKLa2jkMSfGqqzi1unMmxbsVnn4nYPhQGdjScOs7UNwiE.w8edJBdiy4bSd0eU9hlgKYkXd8M78AvqHoxsC46p6kbpQIzdOPGoouzbggYXlE0DJJ.J_t0bHyOpHXpStr7.udgcHbU7DvvusI9UlK.ALXX78bw9_oGM1ufo3XfQsF_V4YC7off5Km7orY; OptanonConsent=isGpcEnabled=1&datestamp=Tue+Mar+10+2026+19%3A04%3A11+GMT%2B0100+(heure+normale+d%E2%80%99Europe+centrale)&version=202512.1.0&browserGpcFlag=1&isIABGlobal=false&consentId=381bd2c9-1df5-476e-ac0a-4785e4c74099&interactionCount=2&isAnonUser=1&intType=2&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A0%2CC0003%3A0%2CC0004%3A0%2CC0005%3A0%2CV2STACK42%3A0%2CC0035%3A0%2CC0038%3A0&genVendors=V2%3A0%2CV1%3A0%2C&geolocation=FR%3BIDF&AwaitingReconsent=false; is_shipping_fees_applied_info_banner_dismissed=false; banners_ui_state=SUCCESS; viewport_size=784; v_sid=4d171c333c8d44517ef331a331a99446; _vinted_fr_session=aWtxWFlIclJYQVFGWkV5cU1VcmRJc1l3RTFwTjlvK2FjeHdOTmlkWDNodlZDU1gxOFFQc0hFeGRqNHhTZUQ4aUFvN1Q0QXlMbXJNemNvd2ZkRHNPUFlESzB6b05wWThBdGpaTW1jNi91WHdwNzJuOVBBN0gwV1FMenNVZVp5cHJhZzZCV3p3S3hKQ3M1Rkp0Y2tJb1hYWXlUQjVhOGN2eFp5MGplYktnZUpoNzFOb3BZZlFadFJoQzAvZ1BQRmtnZjcxT1JPY1ZkY243d1BhSnFNdkxFVThRK04zNTFqSE9jb3VPYWwweVkwYytXV0FVS1BPdjBrNTBEVC9rVVZXUC0tY1o3eFFPSWc1S3hNRXk0YWpvc21Qdz09--f85def4bd285b71506b2d115ec8672968bbfb5de; datadome=12rqO9xcmw8HlkNhVokqIwjJZ5nq9SD5vsh1N~zAV_~hMhfHKLkquuYgdonQSPu~pcyu6p202zLng4yMfl1KwwGmcEsw58IL024lr3mt8mvaKFFFrfALstq5YYR8fkvs; OptanonAlertBoxClosed=2026-03-10T17:56:07.077Z; eupubconsent-v2=CQg2SlgQg2SlgAcABBFRCVFgAAAAAEPgAAwIAAAWZABMNCogjLIgACBQEAIEACgrCACgQBAAAkDRAQAmDAhyBgAusJkAIAUAAwQAgABBgACAAASABCIAIACAQAgQCBQABgAQBAQAMDAAGACxEAgABAdAxTAggECwASIyqDTAlAASCAlsqEEgCBBXCEIscAggREwUAAAIABQAAAD4WAhJKCViQQBcQTQAAEAAAUQIECKQswBBQGaLQVgScBkaYBg-YJklOgyAJghIyDIhN-Ew8UxRAAAA.YAAACHwAAAAA.ILNtR_G__bXlv-Tb36bpkeYxf99hr7sQxBgbJs24FzLvW7JwC32E7NEzatqYKmRIAu3TBIQNtHIjURUChKIgVrzDsaEyUoTtKJ-BkiDMRY2JYCFxvm4pjWQCZ4vr_91d9mT-N7dr-2dzyy5hnv3a9fuS1UJicKYetHfn8ZBKT-_IU9_x-_4v4_MbpEm-eS1v_tGtt43d64tP_dpuxt-Tyffz___f72_e7X__c__33_-_Xf_7__4A; OTAdditionalConsentString=1~"
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
      const {photo} = item;
      const published = photo.high_resolution && photo.high_resolution.timestamp;

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
  try {

    if (isNotDefined(COOKIES)) {
      throw "vinted requires a valid cookie";
    }

    const response = await fetch(`https://www.vinted.fr/api/v2/catalog/items?page=1&per_page=96&time=1727382549&search_text=${searchText}&catalog_ids=&size_ids=&brand_ids=89162&status_ids=6,1&material_ids`, {
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