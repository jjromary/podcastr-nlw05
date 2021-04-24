import Image from 'next/image'; 
import { useContext, useEffect, useRef } from 'react'; 
import { PlayerContext } from '../../contexts/PlayerContext'; 
import Slider from 'rc-slider'; 
import 'rc-slider/assets/index.css'; 

import styles from './styles.module.scss'; 

export default function Player() {

  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, togglePlay, 
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  } = useContext(PlayerContext)

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  },[isPlaying])

  const episode = episodeList[currentEpisodeIndex]

  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocanco agora </strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <strong>{episode.members}</strong>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty: ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider
                trackStyle = {{ backgroundColor: '#04d361'}} //altera a cor da barra que ja sofreu progresso
                railStyle  = {{backgroundColor: '#9f75ff' }}// altera a cor da barra que não sofreu progresso
                handleStyle = {{ borderColor: '#04d361', borderWidth: 4}} // cor da bolinha! =) 
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        {/* AUDIO DO PODCAST */}
        { episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        {/* BOTÕES MUILTIMIDIA */}
        <div className={styles.buttons}>
          <button type="button" disabled= {!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button type="button" onClick={playPrevious} disabled= {!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button type="button" 
                  className={styles.playButton} 
                  disabled= {!episode} 
                  onClick={togglePlay}
          >
            {isPlaying 
              ? <img src="/pause.svg" alt="Pausar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>

          <button type="button" onClick={playNext} disabled= {!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button type="button" disabled= {!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}