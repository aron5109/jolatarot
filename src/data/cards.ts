/**
 * Jólatarot — the deck.
 *
 * 22 original Christmas trumps, numbered 0–XXI like a tarot major arcana.
 * Every card has a short upright reading and a reversed one ("öfugt").
 * Readings are written so they fit any position in a spread and never
 * inflect for the reader's gender.
 */

export type CardId =
  | 'jolakotturinn'
  | 'kertasnikir'
  | 'jolastjarnan'
  | 'gryla'
  | 'ljosaserian'
  | 'jolatred'
  | 'mondlugrauturinn'
  | 'laufabraudid'
  | 'jolabokaflodid'
  | 'skorinn'
  | 'hangikjotid'
  | 'skatan'
  | 'nordurljosin'
  | 'snjokarlinn'
  | 'konfektkassinn'
  | 'jolapakkinn'
  | 'litlujolin'
  | 'adventukransinn'
  | 'solstodur'
  | 'kakobollinn'
  | 'aramotabrennan'
  | 'nyjaarid';

export interface TarotCard {
  id: CardId;
  /** 0–21, shown as a Roman numeral on the card. */
  number: number;
  name: string;
  keywords: readonly [string, string, string];
  upright: string;
  reversed: string;
}

export const DECK: readonly TarotCard[] = [
  {
    id: 'jolakotturinn',
    number: 0,
    name: 'Jólakötturinn',
    keywords: ['Nýtt upphaf', 'Hugrekki', 'Óvissa'],
    upright:
      'Jólakötturinn horfir á þig, en ekki af hungri. Hann sér nýtt upphaf. Taktu skrefið, jafnvel þótt sokkarnir séu frá því í fyrra.',
    reversed:
      'Jólakötturinn er á vappi. Áður en þú stekkur út í óvissuna skaltu að minnsta kosti fá þér nýja sokka. Bara til öryggis.',
  },
  {
    id: 'kertasnikir',
    number: 1,
    name: 'Kertasníkir',
    keywords: ['Útsjónarsemi', 'Ljós', 'Frumkvæði'],
    upright:
      'Kertasníkir minnir þig á að eitt lítið ljós dugar til að lýsa upp heilan fund. Þú hefur öll verkfærin sem þarf. Kveiktu á þeim.',
    reversed:
      'Einhver er að sníkja kertin þín, tímann þinn og síðustu piparkökuna. Það má segja nei, líka í desember.',
  },
  {
    id: 'jolastjarnan',
    number: 2,
    name: 'Jólastjarnan',
    keywords: ['Leiðsögn', 'Innsæi', 'Von'],
    upright:
      'Jólastjarnan vísar veginn. Treystu innsæinu. Það ratar betur en forritið sem sendi þig í ranga byggingu á síðasta fund.',
    reversed:
      'Stjarnan er á bak við ský. Það gerir ekkert til. Stundum þarf bara að spyrja til vegar, eða lesa tölvupóstinn til enda.',
  },
  {
    id: 'gryla',
    number: 3,
    name: 'Grýla',
    keywords: ['Kraftur', 'Staðfesta', 'Mörk'],
    upright:
      'Grýla setur skýr mörk og stendur við þau. Í desember færðu sama kraft. Notaðu hann af mildi, og helst ekki á tölvudeildina.',
    reversed:
      'Grýla er í vondu skapi og hefur ekki fengið kaffi. Taktu engar stórar ákvarðanir fyrir klukkan tíu. Fáðu þér kaffi fyrst.',
  },
  {
    id: 'ljosaserian',
    number: 4,
    name: 'Jólaljósaserían',
    keywords: ['Þolinmæði', 'Flækjur', 'Lausnir'],
    upright:
      'Það sem virðist ein stór flækja er bara röð af litlum hnútum. Leystu einn í einu og þá fer allt að lýsa.',
    reversed:
      'Ein pera er sprungin og þess vegna er slökkt á allri seríunni. Finndu litla vandann áður en þú skiptir um allt kerfið.',
  },
  {
    id: 'jolatred',
    number: 5,
    name: 'Jólatréð',
    keywords: ['Rætur', 'Hefðir', 'Stöðugleiki'],
    upright:
      'Jólatréð stendur stöðugt þótt allt hangi utan á því. Ræturnar eru sterkari en þú heldur og hefðirnar halda þér uppi.',
    reversed:
      'Tréð hallar örlítið til vinstri. Það gera allir einhvern tímann. Smá stuðningur og þá verður það alveg fullkomið.',
  },
  {
    id: 'mondlugrauturinn',
    number: 6,
    name: 'Möndlugrauturinn',
    keywords: ['Heppni', 'Óvænt gjöf', 'Leynd'],
    upright:
      'Mandlan er í þinni skál. Óvænt heppni bíður þín, svo framarlega sem þú gleypir hana ekki í fljótfærni.',
    reversed:
      'Einhver annar fékk möndluna í ár. En þú fékkst meiri graut, og það er líka ákveðin tegund af sigri.',
  },
  {
    id: 'laufabraudid',
    number: 7,
    name: 'Laufabrauðið',
    keywords: ['Handverk', 'Nákvæmni', 'Samvinna'],
    upright:
      'Fallegustu mynstrin verða til þegar margar hendur vinna saman. Verkefnið sem þú ert að skera út verður listaverk.',
    reversed:
      'Laufabrauðið brotnaði. Það bragðast samt alveg jafn vel. Ekki láta fullkomnunaráráttuna skemma gott verk.',
  },
  {
    id: 'jolabokaflodid',
    number: 8,
    name: 'Jólabókaflóðið',
    keywords: ['Þekking', 'Sögur', 'Ró'],
    upright:
      'Ný saga er að hefjast og þú ert í aðalhlutverki. Gefðu þér tíma til að lesa, hugsa og sofna í sófanum á annan í jólum.',
    reversed:
      'Bókastaflinn á náttborðinu er orðinn hættulega hár. Byrjaðu á einni. Hinar bíða rólegar eftir þér.',
  },
  {
    id: 'skorinn',
    number: 9,
    name: 'Skórinn í glugganum',
    keywords: ['Eftirvænting', 'Trú', 'Lítil gleði'],
    upright:
      'Eitthvað gott er á leiðinni. Það kemur kannski ekki þegar þú vonaðist eftir því, en það kemur. Settu skóinn út í glugga.',
    reversed:
      'Kartafla í skónum er ekki dómur, heldur vinsamleg ábending. Það er alltaf hægt að bæta stöðuna fyrir næstu nótt.',
  },
  {
    id: 'hangikjotid',
    number: 10,
    name: 'Hangikjötið',
    keywords: ['Gnægð', 'Hefð', 'Hlýja'],
    upright:
      'Gnægð bíður þín, bæði á diskinum og í lífinu. Njóttu hennar án samviskubits og með nóg af uppstúf.',
    reversed:
      'Of mikið af hinu góða er samt of mikið. Mundu eftir vatnsglasinu og göngutúrnum á milli jólaboða.',
  },
  {
    id: 'skatan',
    number: 11,
    name: 'Skatan',
    keywords: ['Seigla', 'Hreinskilni', 'Þolraun'],
    upright:
      'Sumt er erfitt fyrst en verður svo að hefð. Seiglan skilar sér, og lyktin fer að lokum úr fötunum.',
    reversed:
      'Þú þarft ekki að gera allt sem aðrir gera. Það er fullkomlega gilt að mæta í skötuveisluna og borða bara kartöflur.',
  },
  {
    id: 'nordurljosin',
    number: 12,
    name: 'Norðurljósin',
    keywords: ['Innblástur', 'Töfrar', 'Ný sýn'],
    upright:
      'Innblásturinn kemur þegar þú átt síst von á honum. Líttu upp úr skjánum öðru hverju. Himinninn hefur eitthvað að segja.',
    reversed:
      'Spáin var góð en það er skýjað. Góðar hugmyndir þurfa stundum eitt kvöld í viðbót. Ekki gefast upp á þeim.',
  },
  {
    id: 'snjokarlinn',
    number: 13,
    name: 'Snjókarlinn',
    keywords: ['Breytingar', 'Umbreyting', 'Léttleiki'],
    upright:
      'Allt breytist, líka snjókarlar. Það sem bráðnar í dag verður að einhverju nýju á morgun. Taktu breytingunum fagnandi.',
    reversed:
      'Þú heldur fast í eitthvað sem er farið að bráðna. Kannski er kominn tími til að hnoða nýjan snjókarl.',
  },
  {
    id: 'konfektkassinn',
    number: 14,
    name: 'Konfektkassinn',
    keywords: ['Jafnvægi', 'Val', 'Sætleiki'],
    upright:
      'Jafnvægið er lykillinn. Einn mola núna og annan seinna. Þannig endist bæði konfektið og orkan fram yfir áramót.',
    reversed:
      'Einhver kláraði alla karamellumolana á kaffistofunni og skildi marsípanið eftir. Lærðu að meta það sem eftir er.',
  },
  {
    id: 'jolapakkinn',
    number: 15,
    name: 'Jólapakkinn',
    keywords: ['Forvitni', 'Freisting', 'Leyndarmál'],
    upright:
      'Ekki hrista pakkann. Sumt á að bíða réttrar stundar. Forvitnin er góð, en eftirvæntingin er enn betri.',
    reversed:
      'Þú veist nú þegar hvað er í pakkanum. Leyfðu þér samt að verða hissa. Það gleður þann sem gaf.',
  },
  {
    id: 'litlujolin',
    number: 16,
    name: 'Litlu jólin',
    keywords: ['Samvera', 'Gleði', 'Óvænt atvik'],
    upright:
      'Gleðin vex þegar henni er deilt. Mættu á litlu jólin, taktu þátt í leiknum og mundu eftir pakkanum í pakkaleikinn.',
    reversed:
      'Einhver mun syngja í karókí sem hefði betur sleppt því. Brostu, klappaðu og mundu að þetta verður góð saga í janúar.',
  },
  {
    id: 'adventukransinn',
    number: 17,
    name: 'Aðventukransinn',
    keywords: ['Undirbúningur', 'Taktur', 'Tími'],
    upright:
      'Eitt kerti í einu. Þú þarft ekki að klára allt í þessari viku. Góður undirbúningur gerist í rólegum skrefum.',
    reversed:
      'Þú kveiktir á öllum fjórum kertunum fyrsta sunnudaginn. Hægðu aðeins á þér. Desember er lengri en hann virðist.',
  },
  {
    id: 'solstodur',
    number: 18,
    name: 'Vetrarsólstöður',
    keywords: ['Viðsnúningur', 'Von', 'Ljósið snýr aftur'],
    upright:
      'Dimmasti dagurinn er að baki. Héðan í frá lengist dagurinn um nokkrar mínútur á dag, og þolinmæðin með.',
    reversed:
      'Það er dimmt þegar þú mætir og dimmt þegar þú ferð heim. En ljósið er á leiðinni. Það er bara aðeins seint, eins og strætó.',
  },
  {
    id: 'kakobollinn',
    number: 19,
    name: 'Kakóbollinn',
    keywords: ['Hvíld', 'Hlýja', 'Vinátta'],
    upright:
      'Taktu þér hlé, helltu í bolla og settu rjóma ofan á. Bestu samtölin eiga sér stað yfir einhverju heitu.',
    reversed:
      'Kakóið er orðið kalt því þú gleymdir þér í tölvupóstinum. Hvíld er ekki verðlaun. Hún er nauðsyn.',
  },
  {
    id: 'aramotabrennan',
    number: 20,
    name: 'Áramótabrennan',
    keywords: ['Uppgjör', 'Hreinsun', 'Að sleppa'],
    upright:
      'Kastaðu gömlu áhyggjunum á brennuna. Það sem var þungt árið 2026 þarf ekki að fylgja þér inn í nýja árið.',
    reversed:
      'Þú heldur enn á einhverju sem ætti löngu að vera komið á brennuna. Skrifaðu það niður og slepptu því svo.',
  },
  {
    id: 'nyjaarid',
    number: 21,
    name: 'Nýja árið',
    keywords: ['Heild', 'Árangur', 'Nýr kafli'],
    upright:
      'Hringnum er lokað og nýr kafli hefst. Árið 2027 ber merki alls sem þú lærðir í ár, og það lítur vel út.',
    reversed:
      'Áramótaheitin eru orðin tólf. Veldu eitt og gerðu það vel. Hin geta beðið til ársins 2028.',
  },
];

export type SpreadId = 'one' | 'three';

export interface SpreadPosition {
  label: string;
  hint: string;
}

export interface Spread {
  id: SpreadId;
  /** Label on the spread picker. */
  label: string;
  /** Instruction while choosing, e.g. "Veldu þrjú spil". */
  instruction: string;
  positions: readonly SpreadPosition[];
}

export const SPREADS: Record<SpreadId, Spread> = {
  one: {
    id: 'one',
    label: 'Eitt spil',
    instruction: 'Veldu eitt spil',
    positions: [{ label: 'Jólaspilið þitt', hint: 'Það sem desember vill segja þér' }],
  },
  three: {
    id: 'three',
    label: 'Þrjú spil',
    instruction: 'Veldu þrjú spil',
    positions: [
      { label: 'Aðventan', hint: 'Það sem mótar desember' },
      { label: 'Jólin', hint: 'Það sem bíður þín' },
      { label: 'Árið 2027', hint: 'Það sem nýja árið færir' },
    ],
  },
};

/** How many face-down cards are laid out to choose from. */
export const LAYOUT_SIZE = 9;

const ROMAN: readonly [number, string][] = [
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(n: number): string {
  if (n === 0) return '0';
  let rest = n;
  let out = '';
  for (const [value, symbol] of ROMAN) {
    while (rest >= value) {
      out += symbol;
      rest -= value;
    }
  }
  return out;
}
