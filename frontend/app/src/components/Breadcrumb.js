import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Skip breadcrumb on homepage
  if (location.pathname === '/') {
    return null;
  }

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const hash = location.hash.replace('#', '');
  
  // Special handling for panduan-administrasi
  let breadcrumbItems = [
    { label: 'Beranda', path: '/' },
    ...pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Special label for panduan-administrasi
      if (segment === 'panduan-administrasi') {
        label = 'Panduan';
      }
      
      return { label, path };
    })
  ];

  // If there's a hash (sub-menu selected), add it to breadcrumb
  if (hash && location.pathname === '/panduan-administrasi') {
    // Map hash to readable label
    const hashLabelMap = {
      'daftar-ulang': 'Daftar Ulang',
      'cuti-akademik': 'Cuti Akademik',
      'tidak-aktif-kuliah': 'Tidak Aktif Kuliah',
      'pengecekan-nilai': 'Pengecekan Nilai',
      'pindah-lokasi-waktu': 'Pindah Lokasi / Waktu Kuliah',
      'pindah-jurusan': 'Pindah Jurusan'
    };
    const hashLabel = hashLabelMap[hash] || hash
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbItems.push({ 
      label: hashLabel, 
      path: `/panduan-administrasi#${hash}` 
    });
  }

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="breadcrumb-item">
            {index < breadcrumbItems.length - 1 ? (
              <Link to={item.path} className="breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            )}
            {index < breadcrumbItems.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
