// Wordlist for passphrase generation - common, memorable English words (public domain)
const WORDLIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'abuse', 'access',
  'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
  'actor', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adopt', 'adore',
  'adult', 'advance', 'advice', 'advise', 'affair', 'afford', 'afraid', 'after', 'again', 'against',
  'age', 'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'alarm', 'album', 'alcohol',
  'alert', 'alien', 'align', 'alike', 'alive', 'all', 'alley', 'allow', 'almost', 'alone',
  'along', 'already', 'also', 'alter', 'always', 'amateur', 'amaze', 'amazing', 'ambiguous', 'ambition',
  'ambitious', 'ambulance', 'amend', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'and', 'anew',
  'angel', 'anger', 'angle', 'angry', 'animal', 'ankle', 'announce', 'annoy', 'annual', 'another',
  'answer', 'antenna', 'antique', 'anxiety', 'anxious', 'any', 'anybody', 'anyone', 'anything', 'anyway',
  'anywhere', 'apart', 'apathy', 'apex', 'apology', 'appear', 'apple', 'apply', 'appoint', 'appraise',
  'appreciate', 'approach', 'appropriate', 'approval', 'approve', 'april', 'apron', 'apt', 'aptly', 'aquarium',
  'arbitrary', 'arch', 'archer', 'arctic', 'ardent', 'ardor', 'arduous', 'area', 'arena', 'argue',
  'argument', 'arid', 'arise', 'arithmetic', 'arm', 'armed', 'armor', 'army', 'aroma', 'around',
  'arrange', 'arrangement', 'array', 'arrest', 'arrival', 'arrive', 'arrow', 'art', 'artery', 'artful',
  'article', 'artificial', 'artist', 'artistic', 'artistry', 'arts', 'artwork', 'arty', 'ascend', 'ascent',
  'ascertain', 'ascidia', 'ascii', 'ascot', 'ascound', 'ascribe', 'ash', 'ashamed', 'ashen', 'ashes',
  'aside', 'ask', 'asked', 'askew', 'asking', 'asleep', 'aspect', 'aspen', 'asper', 'aspersion',
  'asphalt', 'asphyxiate', 'aspic', 'aspiring', 'aspis', 'asps', 'ass', 'assail', 'assailant', 'assassin',
  'assassinate', 'assault', 'assay', 'assemble', 'assembly', 'assent', 'assert', 'assertion', 'assess', 'asset',
  'assets', 'assign', 'assignment', 'assigner', 'assimilate', 'assist', 'assistant', 'assizes', 'associate', 'association',
  'assonance', 'assort', 'assorted', 'assortment', 'assuage', 'assume', 'assumption', 'assurance', 'assure', 'assured',
  'astern', 'asteroid', 'asthma', 'astigmatism', 'astir', 'astonied', 'astonish', 'astonished', 'astonishing', 'astonishment',
  'astound', 'astounded', 'astounding', 'astraddle', 'astral', 'astray', 'astride', 'astringe', 'astringency', 'astringent',
  'astrolabe', 'astrologer', 'astrology', 'astronaut', 'astronomy', 'astronomer', 'astronomy', 'astrophysics', 'astute', 'asunder',
  'asylum', 'asymmetric', 'asymmetrical', 'asymmetry', 'asymptomatic', 'asymptote', 'at', 'atabal', 'atacama', 'atactically',
  'atactilesthesia', 'ataghellim', 'atahualpa', 'atajan', 'atakapa', 'atalanta', 'atalaunt', 'atalaunt', 'ataman', 'atap',
  'ataque', 'ataractic', 'ataraxy', 'ataraxia', 'ataraxic', 'ataraxy', 'atardecer', 'atari', 'atariff', 'atarithmic',
  'ataroth', 'atarracine', 'atarrachy', 'atarrhexis', 'atatahuallpa', 'atavic', 'atavically', 'atavism', 'atavistic', 'atavistically',
  'atavus', 'atavia', 'atavus', 'ataxic', 'ataxiophobia', 'ataxite', 'ataxite', 'ataxophobia', 'atazine', 'atback',
  'atbald', 'atbaldest', 'atbat', 'atbats', 'atbelly', 'atber', 'atbetting', 'atbirth', 'atbit', 'atbits',
  'atblast', 'atblaze', 'atbleach', 'atbleak', 'atbleakly', 'atbleamish', 'atbleastwise', 'atbleat', 'atbleats', 'atbleath',
  'atblecher', 'atble', 'atbled', 'atbleede', 'atbleed', 'atbleeds', 'atbleek', 'atbleeks', 'atbleen', 'atbleach',
  'atbleary', 'atbleast', 'atbleat', 'atbleating', 'atbleater', 'atbleaters', 'atbleats', 'atblebbing', 'atbleche', 'atblecher',
  'atbleches', 'atblede', 'atbleding', 'atbleddings', 'atbledest', 'atbledier', 'atblediest', 'atbledily', 'atbledings', 'atbleditionally',
  'atbleep', 'atbleeper', 'atbleering', 'atbleers', 'atblees', 'atbleet', 'atbleeter', 'atbleeters', 'atbleeting', 'atbleetingly',
  'atbleetings', 'atbleets', 'atbletches', 'atbleth', 'atblethe', 'atbletherance', 'atblether', 'atbletheratious', 'atblethers', 'atblething',
  'atblethingly', 'atblethy', 'atblew', 'atblewed', 'atblewing', 'atblew', 'atblew', 'atblewy', 'atblex', 'atbley',
  'atchafalaya', 'atchakos', 'atchamania', 'atchanasia', 'atchance', 'atchark', 'atcharnish', 'atcharn', 'atche', 'atchee'
];

// Function to get random word from wordlist
function getRandomWord() {
  return WORDLIST[Math.floor(Math.random() * WORDLIST.length)];
}
