// src/components/news/NewsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../../sanityClient';
import { PortableText } from '@portabletext/react';
import { FaTelegramPlane, FaFacebook, FaTwitter, FaReddit, FaDiscord, FaShareAlt, FaClipboard } from 'react-icons/fa';
import './NewsPage.css';

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "news" && _id == $id][0]{
            title,
            content,
            date,
            "imageUrl": image.asset->url
          }`,
          { id }
        );

        if (data) {
          setNews(data);
        } else {
          console.error("Error: Datos de la noticia no encontrados.");
        }
      } catch (error) {
        console.error("Error fetching news from Sanity:", error);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) return <p>Cargando...</p>;

  const { title, content, date, imageUrl } = news;
  const pageUrl = window.location.href;

  const toggleShareMenu = () => setShowShareMenu(!showShareMenu);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
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
                  <a href={`https://discord.com/channels/@me`} target="_blank" rel="noopener noreferrer">
                    <FaDiscord /> Discord
                  </a>

                  {/* Contenedor de copia de link */}
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
              <PortableText value={content || []} />
            </div>
          </div>
          <button className="newsPage-back-button" onClick={() => navigate(-1)}>Atrás</button>
        </div>
      </div>

      {/* Notificación de copia */}
      <div className={`newsPage-notification ${showNotification ? 'show' : ''}`}>
        Link copiado al portapapeles
      </div>
    </section>
  );
};

export default NewsPage;
