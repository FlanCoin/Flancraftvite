// src/components/news/NewsSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../../sanityClient';
import './NewsSection.css';

const NewsSection = () => {
  const [newsData, setNewsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await client.fetch(`*[_type == "news"] | order(date desc) {
          _id,
          title,
          date,
          "imageUrl": image.asset->url,
          content
        }`);
        setNewsData(data);
      } catch (error) {
        console.error('Error al obtener las noticias de Sanity:', error);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Sin fecha";
    return date.toLocaleDateString();
  };

  const getTextExcerpt = (content, length = 300) => {
    try {
      if (!Array.isArray(content)) return '...';

      const textBlocks = content.filter(
        block => block && block._type === 'block' && Array.isArray(block.children)
      );

      const fullText = textBlocks
        .map(block =>
          block.children
            .map(child => (typeof child.text === 'string' ? child.text : ''))
            .join('')
        )
        .join(' ');

      return fullText.slice(0, length) + '...';
    } catch (error) {
      console.error('Error in getTextExcerpt:', error);
      return '...';
    }
  };

  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);

  const totalPages = Math.ceil(newsData.length / newsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const paginationItems = [];
    const maxPageNumbersToShow = 3;

    if (totalPages <= maxPageNumbersToShow + 3) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      for (let i = 1; i <= 3; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        paginationItems.push(<span key="dots1" className="pagination-dots">...</span>);
        paginationItems.push(
          <button
            key={currentPage}
            onClick={() => handlePageChange(currentPage)}
            className="pagination-button active"
          >
            {currentPage}
          </button>
        );
        paginationItems.push(<span key="dots2" className="pagination-dots">...</span>);
      } else {
        paginationItems.push(<span key="dots1" className="pagination-dots">...</span>);
      }

      for (let i = totalPages - 2; i <= totalPages; i++) {
        paginationItems.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    }

    paginationItems.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : currentPage)}
        className="pagination-button"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    );

    return <div className="newsSection-pagination">{paginationItems}</div>;
  };

  return (
    <section className="newsSection-section">
      <div className="newsSection-wrapper">
        <h1 className="newsSection-title">Noticias Recientes</h1>
        {renderPagination()}
        <div className="newsSection-inner">
          {currentNews.map((news) => (
            <div key={news._id} className="newsSection-item">
              <div className="newsSection-item-header">
                <Link
                  to={`/news/${news._id}`}
                  className="newsSection-item-title-link"
                  title={news.title}
                >
                  <h2 className="newsSection-item-title">{news.title || "Sin título"}</h2>
                </Link>
                <p className="newsSection-item-date">{formatDate(news.date)}</p>
              </div>
              {news.imageUrl && (
                <Link
                  to={`/news/${news._id}`}
                  className="newsSection-item-image-link"
                  title="Ver imagen y detalles"
                >
                  <img
                    src={news.imageUrl}
                    alt={news.title || "Imagen de la noticia"}
                    className="newsSection-item-image"
                  />
                </Link>
              )}
              <div className="newsSection-item-content">
                <p className="newsSection-item-excerpt">
                  {getTextExcerpt(news.content)}
                </p>
                <Link
                  to={`/news/${news._id}`}
                  className="newsSection-read-more"
                  title="Continuar leyendo"
                >
                  Continuar leyendo
                </Link>
              </div>
            </div>
          ))}
        </div>
        {renderPagination()}
        <div className="poster-left"></div>
        <div className="poster-right"></div>
      </div>
    </section>
  );
};

export default NewsSection;
