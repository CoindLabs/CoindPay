import styles from './index.module.scss'

const Background = props => {
  return (
    <section className="relative">
      <div className={styles.main}>
        <div className={styles.content} />
      </div>
      {props?.children}
    </section>
  )
}

export default Background
