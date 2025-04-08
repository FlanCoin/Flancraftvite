import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client, { urlFor } from '../../sanityClient'; // Importar la función urlFor
import { PortableText } from '@portabletext/react';
import { FaTelegramPlane, FaFacebook, FaTwitter, FaReddit, FaDiscord, FaShareAlt, FaClipboard } from 'react-icons/fa';
import './NewsPage.css';

const NewsPage = () => {
  const { slug } = useParams();  // Obtén el slug de la URL
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Primero, buscamos la noticia por slug
        const data = await client.fetch(
          `*[_type == "news" && slug.current == $slug][0]{
            title,
            content,
            date,
            "imageUrl": image.asset->url,
            _id
          }`,
          { slug }
        );
        
        // Si no encontramos la noticia por slug, buscamos por ID
        if (!data) {
          const dataById = await client.fetch(
            `*[_type == "news" && _id == $slug][0]{
              title,
              content,
              date,
              "imageUrl": image.asset->url,
              slug
            }`,
            { slug }
          );

          if (dataById) {
            // Redirigimos inmediatamente a la URL con el slug
            navigate(`/news/${dataById.slug.current}`, { replace: true });
            return;
          } else {
            console.error("Error: Datos de la noticia no encontrados.");
          }
        } else {
          setNews(data);  // Si encontramos la noticia por slug, la mostramos
        }
      } catch (error) {
        console.error("Error fetching news from Sanity:", error);
      }
    };

    fetchNews();
  }, [slug, navigate]);  // Añadimos `navigate` y `slug` como dependencias

  if (!news) return <p>Cargando...</p>;

  const { title, content, date, imageUrl } = news;
  const pageUrl = window.location.href;

  const toggleShareMenu = () => setShowShareMenu(!showShareMenu);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const portableTextComponents = {
    types: {
      image: ({ value }) => {
        const { alt, caption, asset } = value;
        const imageUrl = urlFor(asset).width(800).url(); // Usamos la función `urlFor` aquí

        return (
          <div className="image-container">
            <img src={imageUrl} alt={alt} className="newsPage-image" />
            {caption && <figcaption>{caption}</figcaption>}
          </div>
        );
      },
      youtube: ({ value }) => {
        const { url } = value;
        if (!url) return <p>Video no válido</p>;

        let videoId = null;

        if (url.includes('shorts')) {
          const match = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
          videoId = match ? match[1] : null;
        } else {
          const match = url.match(/v=([^&]+)/);
          videoId = match ? match[1] : null;
        }

        return videoId ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, margin: '2rem 0' }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        ) : (
          <p>Video no válido</p>
        );
      }
    }
  };

  return (
    <section className="newsPage-page">
      <div className="newsPage-wrapper">
        <div className="newsPage-inner-wrapper">
          <header className="newsPage-header">
            <p className="newsPage-date">
              {date ? new Date(date).toLocaleDateString() : "Sin fecha"}
            </p>
            <div className="newsPage-share-container">
              <FaShareAlt className="newsPage-share-icon" onClick={toggleShareMenu} />
              {showShareMenu && (
                <div className="newsPage-share-menu">
                  <p className="newsPage-share-title">Compartir esta noticia</p>
                  <a href={`https://twitter.com/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                    <FaTwitter /> Twitter
                  </a>
                  <a href={`https://www.reddit.com/submit?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                    <FaReddit /> Reddit
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">
                    <FaTelegramPlane /> Telegram
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer">
                    <FaFacebook /> Facebook
                  </a>
                  <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer">
                    <FaDiscord /> Discord
                  </a>
                  <div className="newsPage-copy-link-container">
                    <input
                      type="text"
                      value={pageUrl}
                      readOnly
                      className="newsPage-copy-link"
                    />
                    <button className="newsPage-copy-button" onClick={handleCopyLink}>
                      <FaClipboard />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>

          {imageUrl && (
            <img
              src={imageUrl}
              alt={title || "Imagen de la noticia"}
              className="newsPage-image"
            />
          )}

          <h1 className="newsPage-title">{title || "Sin título"}</h1>

          <div className="newsPage-content-container">
            <div className="newsPage-content">
              <PortableText value={content || []} components={portableTextComponents} />
            </div>
          </div>

          <button className="newsPage-back-button" onClick={() => navigate(-1)}>Atrás</button>
        </div>
      </div>

      <div className={`newsPage-notification ${showNotification ? 'show' : ''}`}>
        Link copiado al portapapeles
      </div>
    </section>
  );
};

export default NewsPage;
