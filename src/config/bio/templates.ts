const styleList = ['S000', 'S001', 'S002', 'S003', 'S004', 'S005']

const themeList = ['T000', 'T001', 'T002', 'T003', 'T004', 'T005', 'T006', 'T007', 'T008', 'T009', 'T010', 'T011']

/**
 * https://colorhunt.co/palettes/popular
 */
const themeColors = [
  ['#FBFBFB', '#000000'],
  ['#EEF1FF', '#D2DAFF', '#AAC4FF', '#B1B2FF', '#C8DBBE', '#5F765F'],
  ['#FFE9C4', '#FFE2E0', '#FFC9C9', '#FFC2CA', '#FF9494', '#ACCBF9'],
  ['#F9CEEE', '#FFBBBB', '#FFE4C0', '#F0FFC2', '#BFFFF0', '#B2A4FF'],
  ['#D0B8A8', '#FA7070', '#FBF2CF', '#C6EBC5', '#A1C298', '#1F2025'],
  ['#FDF9EA', '#F9D7BE', '#F7C9BF', '#8EBDAF', '#BBDCD2', '#7D9B93'],
  ['#FF731D', '#FFF7E9', '#5F9DF7', '#1746A2', '#002E94', '#3e3636'],
  ['#F4B685', '#E8D8FC', '#FF99D7', '#8BBCCC', '#4C6793', '#5C2E7E'],
  ['#B1E5BE', '#83D493', '#367E18', '#F2AAC3', '#EB7EA3', '#21212A'],
  ['#DDF777', '#A7FFE4', '#E398F9', '#5C52C7', '#EC6D53', '#171D24'],
  ['#1572A1', '#9AD0EC', '#EFDAD7', '#E3BEC6', '#F3C5C5', '#6B4F4F'],
  ['#D6CDA4', '#EFFDAA', '#F7C4DD', '#3D5BDB', '#31436C', '#1C6758'],
]

const backdropGradients = [
  'linear-gradient(to bottom, #16222A 0%, #4389A2 100%)',
  'linear-gradient(to bottom, #093028 0%, #237A57 100%)',
  'linear-gradient(to bottom, #ff4b1f 0%, #1fddff 100%)',
  'linear-gradient(to bottom, #AA076B 0%, #4A569D 100%)',
  'linear-gradient(to bottom, #ff6e7f 0%, #bfe9ff 100%)',
  'linear-gradient(to bottom, #603813 0%, #b29f94 100%)',
  'linear-gradient(to bottom, #16A085 0%, #F4D03F 100%)',
  'linear-gradient(to bottom, #780206 0%, #ED4264 100%)',
  'linear-gradient(to bottom, #02AAB0 0%, #00CDAC 100%)',
  'linear-gradient(to bottom, #E55D87 0%, #5FC3E4 100%)',
  'linear-gradient(to bottom, #4776E6 0%, #000046 100%)',
  'linear-gradient(to bottom, #FF512F 0%, #DD2476 100%)',
  'linear-gradient(to bottom, #1A2980 0%, #26D0CE 100%)',
  'linear-gradient(to bottom, #1D2B64 0%, #F8CDDA 100%)',
  'linear-gradient(to bottom, #1FA2FF 0%, #12D8FA 100%)',
  'linear-gradient(to bottom, #4CB8C4 0%, #3CD3AD 100%)',
  'linear-gradient(to bottom, #1D976C 0%, #93F9B9 100%)',
  'linear-gradient(to bottom, #16222A 0%, #3A6073 100%)',
  'linear-gradient(to bottom, #348AC7 0%, #7474BF 100%)',
  'linear-gradient(to bottom, #480048 0%, #C04848 100%)',
  'linear-gradient(to bottom, #414d0b 0%, #727a17 100%)',
  'linear-gradient(to bottom, #FC354C 0%, #0ABFBC 100%)',
  'linear-gradient(to bottom, #182848 0%, #4b6cb7 100%)',
  'linear-gradient(to bottom, #f857a6 0%, #ff5858 100%)',
  'linear-gradient(to bottom, #870000 0%, #190A05 100%)',
  'linear-gradient(to bottom, #0072ff 0%, #00c6ff 100%)',
  'linear-gradient(to bottom, #f83600 0%, #fe8c00 100%)',
  'linear-gradient(to bottom, #6441A5 0%, #2a0845 100%)',
  'linear-gradient(to bottom, #00bf8f 0%, #001510 100%)',
  'linear-gradient(to bottom, #7b4397 0%, #dc2430 100%)',
  'linear-gradient(to bottom, #00C9FF 0%, #92FE9D 100%)',
  'linear-gradient(to bottom, #673AB7 0%, #512DA8 100%)',
  'linear-gradient(to bottom, #a044ff 0%, #6a3093 100%)',
  'linear-gradient(to bottom, #0099F7 0%, #d04ed6 100%)',
  'linear-gradient(to bottom, #2196f3 0%, #f44336 100%)',
  'linear-gradient(to bottom, #de6161 0%, #2657eb 100%)',
  'linear-gradient(to bottom, #ff00cc 0%, #333399 100%)',
  'linear-gradient(to bottom, #3494E6 0%, #EC6EAD 100%)',
  'linear-gradient(to bottom, #45B649 0%, #DCE35B 100%)',
  'linear-gradient(to bottom, #093028 0%, #237A57 100%)',
  'linear-gradient(to bottom, #4568DC 0%, #B06AB3 100%)',
  'linear-gradient(to bottom, #0575E6 0%, #021B79 100%)',
  'linear-gradient(to bottom, #34e89e 0%, #0f3443 100%)',
  'linear-gradient(to bottom, #1D2671 0%, #C33764 100%)',
  'linear-gradient(to bottom, #4AC29A 0%, #BDFFF3 100%)',
  'linear-gradient(to bottom, #007991 0%, #78ffd6 100%)',
  'linear-gradient(to bottom, #EB5757 0%, #000000 100%)',
  'linear-gradient(to bottom, #0cebeb 0%, #20e3b2 100%)',
  'linear-gradient( 135deg, #CE9FFC 10%, #7367F0 100%)',
  'linear-gradient( 135deg, #FFA6B7 10%, #1E2AD2 100%)',
  'from-stone-900/90 to-stone-900/50',
]

const backdropList = [...Array(78).keys()].map(item => {
  return { type: `B0${item > 8 ? '' : '0'}${item + 1}` }
})

export { styleList, themeList, themeColors, backdropList, backdropGradients }
