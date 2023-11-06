//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export const responselist = {
    //Redirect responses
    300: "STATUS 300: Er zijn meerdere mogelijke antwoorden.",
    301: "STATUS 301: De gebruikte link is permanent veranderd.",
    302: "STATUS 302: De gebruikte link is tijdelijk veranderd.",
    303: "STATUS 303: Een andere link moet gebruikt worden om het gevraagde te verkrijgen.",
    304: "STATUS 304: Het antwoord is niet veranderd sinds laatste request.", //Cached
    305: "STATUS 305: Gebruik van een proxy server is nodig.",
    307: "STATUS 307: De gebruikte link is tijdelijk veranderd, maar de gebruikte methode kan opnieuw gebruikt worden.",
    308: "STATUS 308: De gebruikte link is permanent veranderd, maar de gebruikte methode kan opnieuw gebruikt worden.",
  
    //Client errors
    400: "ERROR 400: Er is iets mis met de request.",
    401: "ERROR 401: Je moet waarschijnlijk een code meegeven om dit te kunnen doen.",
    402: "ERROR 402: Er moet betaald worden om dit te doen.",
    403: "ERROR 403: De server laat niet toe wat je probeert te doen.",
    404: "ERROR 404: De ingegeven link wordt niet herkend.",
    405: "ERROR 405: Deze methode is niet toegestaan op deze link.",
    406: "ERROR 406: Er werd geen data gevonden",
    407: "ERROR 407: Authenticatie door proxy nodig.",
    408: "ERROR 408: De request is tijdelijk geannuleerd.",
    409: "ERROR 409: Het gevraagde kan (tijdelijk) niet uitgevoerd worden.",
    410: "ERROR 410: De gevraagde data is verwijderd van de server.",
    411: "ERROR 411: Er moet een 'Content-Length' gespecificeerd worden.",
    412: "ERROR 412: Preconditie is niet gelukt.",
    413: "ERROR 413: Er wordt te veel gevraagd van de server.",
    415: "ERROR 415: Het gevraagde data-type wordt niet ondersteund door de server.",
    416: "ERROR 416: De 'Range' die gezet is, is niet acceptabel.",
    417: "ERROR 417: De server kan de gevraagde 'Expect' niet halen.",
    418: "ERROR 418: De server kan het gevraagde niet doen.",
    421: "ERROR 421: De server kan geen antwoord geven.",
    425: "ERROR 425: De server voert geen requests uit die mogelijks meerdere keren gevraagd gaan worden.",
    426: "ERROR 426: Protocol moet geupdate worden.",
    428: "ERROR 428: Er moet een preconditie meegegeven worden aan de request.",
    429: "ERROR 429: Te veel requests zijn gestuurd in een bepaalde tijd.",
    431: "ERROR 431: De Header fields zijn te groot en moeten verkleint worden.",
    451: "ERROR 451: De gevraagde link kan niet gebruikt worden doordat het gebruik illegaal is.",
  
    //Server errors
    500: "ERROR 500: Er is iets mis met de server.",
    501: "ERROR 501: De server ondersteunt de gebruikte methode niet.",
    502: "ERROR 502: Er is iets mis met de server.",
    503: "ERROR 503: De server is tijdelijk niet bereikbaar.",
    504: "ERROR 504: De server kon niet op tijd een antwoord verkrijgen.",
    505: "ERROR 505: De HTTP versie, die gebruikt wordt in de link, wordt niet ondersteund.",
    506: "ERROR 506: Er is iets mis met de server.",
    510: "ERROR 510: Er zijn niet genoeg waardes meegegeven om dit te doen.",
    511: "ERROR 511: Authenticatie is nodig om gebruik te maken van het netwerk."
  }