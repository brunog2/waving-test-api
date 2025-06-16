interface CategoryData {
  name: string;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  categoryId: string;
}

export const categories: CategoryData[] = [
  { name: 'Eletrodomésticos' },
  { name: 'Eletrônicos' },
  { name: 'Móveis' },
  { name: 'Informática' },
  { name: 'Celulares' },
  { name: 'Cama, Mesa e Banho' },
  { name: 'Decoração' },
  { name: 'Cozinha' },
  { name: 'Ferramentas' },
  { name: 'Iluminação' },
];

export const generateProducts = (
  categoryId: string,
  categoryName: string,
): ProductData[] => {
  const products: ProductData[] = [];

  switch (categoryName) {
    case 'Eletrodomésticos':
      products.push(
        {
          name: 'Geladeira Brastemp Frost Free',
          description:
            'Geladeira Brastemp Frost Free 375L com Freezer, Inox - BRM45JK',
          price: 3499.9,
          imageUrl: 'https://example.com/images/geladeira-brastemp.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Fogão 5 Bocas Consul',
          description:
            'Fogão 5 Bocas Consul com Mesa de Vidro e Acendimento Automático',
          price: 1299.9,
          imageUrl: 'https://example.com/images/fogao-consul.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Máquina de Lavar Electrolux',
          description:
            'Máquina de Lavar Electrolux 11kg com Ciclo Tira Manchas',
          price: 1899.9,
          imageUrl: 'https://example.com/images/lavadora-electrolux.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Micro-ondas Panasonic',
          description: 'Micro-ondas Panasonic 31L com Grill e Função Sensor',
          price: 799.9,
          imageUrl: 'https://example.com/images/microondas-panasonic.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Lava-Louças Brastemp',
          description: 'Lava-Louças Brastemp 14 Serviços com Ciclo Rápido',
          price: 2499.9,
          imageUrl: 'https://example.com/images/lava-loucas-brastemp.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Ar Condicionado Split LG',
          description:
            'Ar Condicionado Split LG 12000 BTUs com Tecnologia Inverter',
          price: 2199.9,
          imageUrl: 'https://example.com/images/ar-condicionado-lg.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Secadora de Roupas Samsung',
          description:
            'Secadora de Roupas Samsung 8kg com Ciclo Anti-Enrugamento',
          price: 2799.9,
          imageUrl: 'https://example.com/images/secadora-samsung.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Purificador de Água Electrolux',
          description:
            'Purificador de Água Electrolux com Filtro de Carvão Ativado',
          price: 399.9,
          imageUrl: 'https://example.com/images/purificador-electrolux.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Ventilador de Teto Dako',
          description: 'Ventilador de Teto Dako 6 Pás com Controle Remoto',
          price: 299.9,
          imageUrl: 'https://example.com/images/ventilador-dako.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Aspirador de Pó Electrolux',
          description: 'Aspirador de Pó Electrolux com Tecnologia Cyclonic',
          price: 499.9,
          imageUrl: 'https://example.com/images/aspirador-electrolux.jpg',
          available: true,
          categoryId,
        },
      );
      break;

    case 'Eletrônicos':
      products.push(
        {
          name: 'Smart TV Samsung 55"',
          description: 'Smart TV Samsung 55" 4K com Tecnologia QLED',
          price: 3999.9,
          imageUrl: 'https://example.com/images/tv-samsung.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Soundbar LG',
          description: 'Soundbar LG com Subwoofer e Tecnologia Meridian',
          price: 1299.9,
          imageUrl: 'https://example.com/images/soundbar-lg.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Home Theater Sony',
          description: 'Home Theater Sony 5.1 Canais com Bluetooth',
          price: 1499.9,
          imageUrl: 'https://example.com/images/home-theater-sony.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Câmera Canon EOS',
          description: 'Câmera Canon EOS Rebel T7 com Lente 18-55mm',
          price: 2999.9,
          imageUrl: 'https://example.com/images/camera-canon.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Drone DJI Mini',
          description: 'Drone DJI Mini 2 com Câmera 4K e Controle Remoto',
          price: 3499.9,
          imageUrl: 'https://example.com/images/drone-dji.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Console PlayStation 5',
          description: 'Console PlayStation 5 com Controle DualSense',
          price: 4499.9,
          imageUrl: 'https://example.com/images/ps5.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Console Xbox Series X',
          description: 'Console Xbox Series X com Controle Sem Fio',
          price: 4299.9,
          imageUrl: 'https://example.com/images/xbox.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Smartwatch Apple Watch',
          description: 'Smartwatch Apple Watch Series 7 com GPS',
          price: 3999.9,
          imageUrl: 'https://example.com/images/apple-watch.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Tablet Samsung Galaxy',
          description: 'Tablet Samsung Galaxy Tab S7 com S Pen',
          price: 2999.9,
          imageUrl: 'https://example.com/images/tablet-samsung.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Kindle Amazon',
          description: 'Kindle Amazon 10ª Geração com Iluminação Integrada',
          price: 499.9,
          imageUrl: 'https://example.com/images/kindle.jpg',
          available: true,
          categoryId,
        },
      );
      break;

    case 'Móveis':
      products.push(
        {
          name: 'Sofá Retrátil 3 Lugares',
          description: 'Sofá Retrátil 3 Lugares com Tecido Suede',
          price: 1999.9,
          imageUrl: 'https://example.com/images/sofa-retratil.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Mesa de Jantar 6 Lugares',
          description: 'Mesa de Jantar 6 Lugares em Madeira Maciça',
          price: 1499.9,
          imageUrl: 'https://example.com/images/mesa-jantar.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Cama Box Casal',
          description: 'Cama Box Casal com Baú e Colchão Ortobom',
          price: 2499.9,
          imageUrl: 'https://example.com/images/cama-box.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Guarda-Roupa 6 Portas',
          description: 'Guarda-Roupa 6 Portas com Espelho',
          price: 2999.9,
          imageUrl: 'https://example.com/images/guarda-roupa.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Rack para TV 55"',
          description: 'Rack para TV 55" com Prateleiras e Gavetas',
          price: 899.9,
          imageUrl: 'https://example.com/images/rack-tv.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Escrivaninha Home Office',
          description: 'Escrivaninha Home Office com Gavetas',
          price: 699.9,
          imageUrl: 'https://example.com/images/escrivaninha.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Estante para Livros',
          description: 'Estante para Livros 5 Prateleiras',
          price: 499.9,
          imageUrl: 'https://example.com/images/estante.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Puff Decorativo',
          description: 'Puff Decorativo com Tecido Suede',
          price: 299.9,
          imageUrl: 'https://example.com/images/puff.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Cadeira de Escritório',
          description: 'Cadeira de Escritório Ergonômica com Apoio Lombar',
          price: 599.9,
          imageUrl: 'https://example.com/images/cadeira-escritorio.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Painel para TV',
          description: 'Painel para TV com Nichos e Iluminação LED',
          price: 799.9,
          imageUrl: 'https://example.com/images/painel-tv.jpg',
          available: true,
          categoryId,
        },
      );
      break;

    case 'Informática':
      products.push(
        {
          name: 'Notebook Dell Inspiron',
          description: 'Notebook Dell Inspiron i5 8GB 256GB SSD',
          price: 3999.9,
          imageUrl: 'https://example.com/images/notebook-dell.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Monitor LG 24"',
          description: 'Monitor LG 24" Full HD IPS',
          price: 899.9,
          imageUrl: 'https://example.com/images/monitor-lg.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Teclado Mecânico Logitech',
          description: 'Teclado Mecânico Logitech G Pro X',
          price: 699.9,
          imageUrl: 'https://example.com/images/teclado-logitech.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Mouse Gamer Razer',
          description: 'Mouse Gamer Razer DeathAdder V2',
          price: 299.9,
          imageUrl: 'https://example.com/images/mouse-razer.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Headset HyperX',
          description: 'Headset HyperX Cloud II com Microfone',
          price: 499.9,
          imageUrl: 'https://example.com/images/headset-hyperx.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Webcam Logitech C920',
          description: 'Webcam Logitech C920 HD Pro',
          price: 399.9,
          imageUrl: 'https://example.com/images/webcam-logitech.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Impressora HP LaserJet',
          description: 'Impressora HP LaserJet Pro MFP',
          price: 1499.9,
          imageUrl: 'https://example.com/images/impressora-hp.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'HD Externo Seagate',
          description: 'HD Externo Seagate 1TB USB 3.0',
          price: 399.9,
          imageUrl: 'https://example.com/images/hd-seagate.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Pendrive SanDisk',
          description: 'Pendrive SanDisk 64GB USB 3.0',
          price: 49.9,
          imageUrl: 'https://example.com/images/pendrive-sandisk.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Roteador TP-Link',
          description: 'Roteador TP-Link Archer C6 AC1200',
          price: 199.9,
          imageUrl: 'https://example.com/images/roteador-tplink.jpg',
          available: true,
          categoryId,
        },
      );
      break;

    case 'Celulares':
      products.push(
        {
          name: 'iPhone 13 Pro',
          description: 'iPhone 13 Pro 128GB Grafite',
          price: 8999.9,
          imageUrl: 'https://example.com/images/iphone13.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Samsung Galaxy S21',
          description: 'Samsung Galaxy S21 128GB Phantom Gray',
          price: 3999.9,
          imageUrl: 'https://example.com/images/galaxy-s21.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Motorola Moto G82',
          description: 'Motorola Moto G82 128GB Preto',
          price: 1999.9,
          imageUrl: 'https://example.com/images/moto-g82.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Xiaomi Redmi Note 11',
          description: 'Xiaomi Redmi Note 11 128GB Preto',
          price: 1499.9,
          imageUrl: 'https://example.com/images/redmi-note11.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Capa para iPhone',
          description: 'Capa para iPhone 13 Pro com Suporte para Cartão',
          price: 99.9,
          imageUrl: 'https://example.com/images/capa-iphone.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Carregador USB-C',
          description: 'Carregador USB-C 20W com Cabo',
          price: 79.9,
          imageUrl: 'https://example.com/images/carregador-usbc.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Fone Bluetooth Samsung',
          description: 'Fone Bluetooth Samsung Galaxy Buds Pro',
          price: 899.9,
          imageUrl: 'https://example.com/images/galaxy-buds.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Power Bank 20000mAh',
          description: 'Power Bank 20000mAh com Carregamento Rápido',
          price: 199.9,
          imageUrl: 'https://example.com/images/power-bank.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Suporte para Celular',
          description: 'Suporte para Celular com Ajuste de Altura',
          price: 49.9,
          imageUrl: 'https://example.com/images/suporte-celular.jpg',
          available: true,
          categoryId,
        },
        {
          name: 'Película para Celular',
          description: 'Película para Celular Vidro Temperado 9H',
          price: 29.9,
          imageUrl: 'https://example.com/images/pelicula-celular.jpg',
          available: true,
          categoryId,
        },
      );
      break;

    // Adicione os outros casos aqui...
    default:
      // Produtos genéricos para outras categorias
      for (let i = 1; i <= 10; i++) {
        products.push({
          name: `${categoryName} ${i}`,
          description: `Produto de alta qualidade da categoria ${categoryName}`,
          price: Math.random() * 900 + 100,
          imageUrl: `https://example.com/images/${categoryName.toLowerCase()}-${i}.jpg`,
          available: Math.random() > 0.1,
          categoryId,
        });
      }
  }

  return products;
};
