document.addEventListener('DOMContentLoaded', () => {
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active Link Highlighting using window location (fallback if not hardcoded)
        // O highlighting é agora gerido por HTML (class="active" hardcoded por página), 
        // pelo que esta secção não precisa de forçar a class ativa baseada no scroll.
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const phoneLink = document.querySelector('.phone-link');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            // For a complete version, we would manage a slide-in menu here.
            // This is a simple toggle logic.
            const isOpen = navLinksContainer.style.display === 'flex';
            if (isOpen) {
                navLinksContainer.style.display = 'none';
                phoneLink.style.display = 'none';
            } else {
                navLinksContainer.style.display = 'flex';
                navLinksContainer.style.flexDirection = 'column';
                navLinksContainer.style.position = 'absolute';
                navLinksContainer.style.top = '80px';
                navLinksContainer.style.left = '0';
                navLinksContainer.style.width = '100%';
                navLinksContainer.style.background = 'rgba(255, 255, 255, 0.98)';
                navLinksContainer.style.padding = '2rem';
                navLinksContainer.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                
                phoneLink.style.display = 'flex';
                phoneLink.style.padding = '1rem 0';
            }
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinksContainer.style.display === 'flex') {
                    navLinksContainer.style.display = 'none';
                }
            }
        });
    });

    // ==========================================
    // VIATURAS DYNAMIC RENDERING (A-Z Sorting)
    // ==========================================
    const stockGeral = [
        {"marca": "BMW", "modelo": "X1 SDRIVE 18D", "img": "car2.png", "ano": "2015", "km": "150.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "SEAT", "modelo": "ALTEA XL 1.6 TDI", "img": "car1.png", "ano": "2012", "km": "180.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "VOLVO", "modelo": "S40", "img": "car2.png", "ano": "2010", "km": "210.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "CITROEN", "modelo": "C4 Picasso", "img": "car1.png", "ano": "2014", "km": "165.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "CITROEN", "modelo": "C3", "img": "car2.png", "ano": "-", "km": "-", "preco": "-", "status": "vendido"},
        {"marca": "SEAT", "modelo": "Leon Station", "img": "car1.png", "ano": "-", "km": "-", "preco": "-", "status": "vendido"},
        {"marca": "FIAT", "modelo": "Punto Van", "img": "car2.png", "ano": "2011", "km": "140.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "PEUGEOT", "modelo": "207", "img": "car1.png", "ano": "2009", "km": "170.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "DS", "modelo": "4", "img": "car2.png", "ano": "2016", "km": "120.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "OPEL", "modelo": "Insignia", "img": "car1.png", "ano": "2015", "km": "160.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "HONDA", "modelo": "Civic", "img": "car2.png", "ano": "2018", "km": "85.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "MERCEDES-BENZ", "modelo": "A 180 d AMG Line", "img": "car1.png", "ano": "2019", "km": "95.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "RENAULT", "modelo": "CLIO BREACK", "img": "car1.png", "ano": "2017", "km": "110.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "RENAULT", "modelo": "Megane Breack", "img": "car2.png", "ano": "2018", "km": "105.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "PEUGEOT", "modelo": "308 SW", "img": "car1.png", "ano": "2016", "km": "135.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "OPEL", "modelo": "Insignia ST", "img": "car2.png", "ano": "2018", "km": "115.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "RENAULT", "modelo": "Clio", "img": "car1.png", "ano": "2020", "km": "60.000", "preco": "Sob Consulta", "status": "disponivel"},
        {"marca": "MERCEDES-BENZ", "modelo": "GLA 180 CDI", "img": "car2.png", "ano": "-", "km": "-", "preco": "-", "status": "vendido"},
        {"marca": "SMART", "modelo": "FORTWO CDI", "img": "car1.png", "ano": "-", "km": "-", "preco": "-", "status": "vendido"},
        {"marca": "VW", "modelo": "POLO", "img": "car2.png", "ano": "2015", "km": "125.000", "preco": "Sob Consulta", "status": "disponivel"}
    ];

    const activeStockGrid = document.getElementById('active-stock-grid');
    const soldStockGrid = document.getElementById('sold-stock-grid');
    const orderBySelect = document.querySelector('.filter-group select:nth-of-type(1)'); // The simple selection for mock
    // Wait, let's target the exact select.
    const sortSelects = document.querySelectorAll('select');
    let sortSelect = null;
    sortSelects.forEach(sel => { if(sel.innerHTML.includes('Ordem Alfabética')) sortSelect = sel; });

    function renderCars(cars) {
        if (!activeStockGrid || !soldStockGrid) return;
        
        activeStockGrid.innerHTML = '';
        soldStockGrid.innerHTML = '';

        cars.forEach(car => {
            const cardHTML = `
            <div class="car-card" ${car.status === 'vendido' ? 'style="filter: grayscale(100%);"' : ''}>
                ${car.status === 'vendido' ? '<div class="car-badge" style="background: var(--secondary); color: white;">Vendido</div>' : '<div class="car-badge novo">Exemplo</div>'}
                <div class="car-img" style="padding:0; overflow:hidden;"><img src="${car.img}" alt="${car.marca}" style="width:100%; height:100%; object-fit:cover;"></div>
                <div class="car-info">
                    <h3>${car.marca} ${car.modelo}</h3>
                    <div class="car-specs">
                        <span><i class="ph ph-calendar"></i> ${car.ano}</span>
                        <span><i class="ph ph-gauge"></i> ${car.km}</span>
                    </div>
                    <div class="car-price-row">
                        <span class="price" ${car.status === 'vendido' ? 'style="color: var(--text-secondary); font-size:1rem;"' : ''}>${car.status === 'vendido' ? 'Indisponível' : car.preco}</span>
                        ${car.status === 'vendido' ? '' : '<a href="contactos.html" class="btn-small" style="background:var(--primary); color:white; border-color:var(--primary);">Contactar</a>'}
                    </div>
                </div>
            </div>`;

            if (car.status === 'vendido') {
                soldStockGrid.innerHTML += cardHTML;
            } else {
                activeStockGrid.innerHTML += cardHTML;
            }
        });
    }

    if (activeStockGrid) {
        // Initial Render
        renderCars(stockGeral);

        // Sort Logic
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                let sortedCars = [...stockGeral];

                if (val.includes('A-Z')) {
                    sortedCars.sort((a, b) => (a.marca + a.modelo).localeCompare(b.marca + b.modelo));
                } else if (val.includes('Z-A')) {
                    sortedCars.sort((a, b) => (b.marca + b.modelo).localeCompare(a.marca + a.modelo));
                }

                renderCars(sortedCars);
            });
            // Force Alpha sorting initially if they asked for it
            sortSelect.value = sortSelect.options[1].text; 
            sortSelect.dispatchEvent(new Event('change'));
        }
    }
});
