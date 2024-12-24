const Notificaiton = ({message}) => {
    if (message == null) {
      return null
    }
    return (
      <div className='notiMessage'>
        {message}
      </div>
    )
  }

  export default Notificaiton