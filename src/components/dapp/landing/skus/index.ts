export interface TplsProps {
  style?: string
}

const Skus = {
  S000: {
    bg: {
      color: 'bg-black',
    },
    font: {
      color: 'text-white',
    },
    card: {
      bg: 'bg-badge-gradient-002',
      hover: 'borderFlow',
    },
  },
  S001: {
    bg: {
      color: 'bg-stone-900',
    },
    font: {
      color: 'text-white',
    },
    card: {
      bg: 'bg-neutral-900',
      hover: 'borderFlow',
      borderCounter: 'rainbow',
    },
  },
  S002: {
    bg: {
      color: 'bg-slate-900',
    },
    font: {
      color: 'text-white',
    },
    card: {
      bg: 'bg-zinc-900',
      hover: 'borderFlow',
      // hsla(0,0%,100%,0.3) 30deg 50deg, hsla(0,0%,100%,0.3) 220deg 240deg 分别是左上角和右下角的色值,分别向两端渐变
      '--border-bg':
        'conic-gradient(from 245deg, hsla(0,0%,100%,0.01) 0deg, hsla(0,0%,100%,0.5) 30deg 50deg, hsla(0,0%,100%,0.01), hsla(0,0%,100%,0.5) 220deg 240deg, hsla(0,0%,100%,0.01))',
    },
  },
  S003: {
    bg: {
      color: 'bg-gray-900',
    },
    font: {
      color: 'text-white',
    },
    card: {
      bg: 'bg-zinc-900 hover:shadow-zinc-900/5',
      hover: 'gridPattern',
    },
  },
  S004: {
    bg: {
      color: 'bg-neutral-900',
      blur: 'backdrop-blur',
    },
    font: {
      color: 'text-white',
    },
    card: {
      bg: 'bg-slate-900',
      hover: 'lighting',
    },
  },
  S005: {
    bg: {
      color: 'bg-white',
    },
    font: {
      color: 'text-black',
    },
    card: {
      bg: 'bg-white',
      padding: 'px-0 pt-0',
      bordered: 'border border-zinc-200/60',
    },
  },
}

export default Skus
