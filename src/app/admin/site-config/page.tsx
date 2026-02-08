'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Stack,
  TextInput,
  Textarea,
  Switch,
  Button,
  Group,
  Text,
  Accordion,
  ColorInput,
  Skeleton,
  Badge,
  NumberInput,
  Select,
  ActionIcon,
} from '@mantine/core';
import {
  IconBell,
  IconPhoto,
  IconFlame,
  IconDeviceFloppy,
  IconBuilding,
  IconMessageCircle,
  IconDiamond,
  IconShieldCheck,
  IconBoxMultiple,
  IconMail,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';
import { useSiteConfigsAdmin, useCreateSiteConfig, useUpdateSiteConfig } from '@/hooks/useSiteConfig';
import {
  SiteConfig,
  GeneralConfig,
  TopBarConfig,
  HeroConfig,
  SpecialOfferConfig,
  TestimonialsConfig,
  ValuePropositionConfig,
  TrustBarConfig,
  ProductCarouselsConfig,
  NewsletterConfig,
  CategoryGridConfig,
} from '@/types';
import { IconCategory } from '@tabler/icons-react';
import { availableIcons } from '@/lib/icon-map';

const iconSelectData = availableIcons.map((name) => ({ value: name, label: name }));

function getConfigValue<T>(configs: SiteConfig[] | undefined, key: string): T | null {
  const config = configs?.find((c) => c.key === key);
  return config ? (config.value as T) : null;
}

function getConfigIsActive(configs: SiteConfig[] | undefined, key: string): boolean {
  const config = configs?.find((c) => c.key === key);
  return config?.isActive ?? true;
}

function configExists(configs: SiteConfig[] | undefined, key: string): boolean {
  return !!configs?.find((c) => c.key === key);
}

// ==================== General Form ====================
function GeneralForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'general');

  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [keywords, setKeywords] = useState('');
  const [titleSuffix, setTitleSuffix] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<GeneralConfig>(configs, 'general');
    if (config) {
      setStoreName(config.storeName || '');
      setStoreDescription(config.storeDescription || '');
      setFacebook(config.socialLinks?.facebook || '');
      setInstagram(config.socialLinks?.instagram || '');
      setTwitter(config.socialLinks?.twitter || '');
      setTiktok(config.socialLinks?.tiktok || '');
      setFaviconUrl(config.faviconUrl || '');
      setOgImage(config.ogImage || '');
      setKeywords(config.keywords || '');
      setTitleSuffix(config.titleSuffix || '');
    }
    setIsActive(getConfigIsActive(configs, 'general'));
  }, [configs]);

  const handleSave = () => {
    const socialLinks: GeneralConfig['socialLinks'] = {};
    if (facebook) socialLinks.facebook = facebook;
    if (instagram) socialLinks.instagram = instagram;
    if (twitter) socialLinks.twitter = twitter;
    if (tiktok) socialLinks.tiktok = tiktok;

    const value: GeneralConfig = {
      storeName: storeName || 'Mi Tienda',
      storeDescription: storeDescription || undefined,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      faviconUrl: faviconUrl || undefined,
      ogImage: ogImage || undefined,
      keywords: keywords || undefined,
      titleSuffix: titleSuffix || undefined,
    };

    if (existing) {
      updateMutation.mutate({ key: 'general', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'general', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Nombre de la tienda"
        placeholder="Mi Tienda"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        description="Se muestra en el header, footer y metadatos SEO"
      />
      <Textarea
        label="Descripción"
        placeholder="Tu tienda online de confianza..."
        value={storeDescription}
        onChange={(e) => setStoreDescription(e.target.value)}
        minRows={2}
      />
      <Text size="sm" fw={500} mt="xs">Redes Sociales</Text>
      <Group grow>
        <TextInput
          label="Facebook"
          placeholder="https://facebook.com/mitienda"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />
        <TextInput
          label="Instagram"
          placeholder="https://instagram.com/mitienda"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Twitter / X"
          placeholder="https://twitter.com/mitienda"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
        />
        <TextInput
          label="TikTok"
          placeholder="https://tiktok.com/@mitienda"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
        />
      </Group>
      <Text size="sm" fw={500} mt="xs">SEO y Metadatos</Text>
      <TextInput
        label="Sufijo del título"
        placeholder="Tu tienda online de confianza"
        description="Se muestra después del nombre: 'Mi Tienda - [sufijo]'"
        value={titleSuffix}
        onChange={(e) => setTitleSuffix(e.target.value)}
      />
      <TextInput
        label="Keywords SEO"
        placeholder="tienda, online, productos..."
        description="Separadas por comas"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <TextInput
        label="Favicon URL"
        placeholder="/favicon.ico"
        description="URL de la imagen del favicon"
        value={faviconUrl}
        onChange={(e) => setFaviconUrl(e.target.value)}
      />
      <TextInput
        label="Imagen OG (Open Graph)"
        placeholder="https://..."
        description="Imagen para compartir en redes (1200x630px recomendado)"
        value={ogImage}
        onChange={(e) => setOgImage(e.target.value)}
      />
      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== TopBar Form ====================
function TopBarForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'topbar');

  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<TopBarConfig>(configs, 'topbar');
    if (config) {
      setMessage(config.message || '');
      setIsVisible(config.isVisible ?? true);
      setBackgroundColor(config.backgroundColor || '');
      setTextColor(config.textColor || '');
    }
    setIsActive(getConfigIsActive(configs, 'topbar'));
  }, [configs]);

  const handleSave = () => {
    const value: TopBarConfig = {
      message,
      isVisible,
      backgroundColor: backgroundColor || undefined,
      textColor: textColor || undefined,
    };

    if (existing) {
      updateMutation.mutate({ key: 'topbar', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'topbar', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Mensaje"
        placeholder="Envío gratis en pedidos mayores a $50.000"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Group grow>
        <ColorInput
          label="Color de fondo"
          placeholder="#1a1b1e"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
        <ColorInput
          label="Color del texto"
          placeholder="#ffffff"
          value={textColor}
          onChange={setTextColor}
        />
      </Group>
      <Switch
        label="Barra visible"
        description="Controla si el mensaje se muestra en el TopBar"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />
      <Switch
        label="Configuración activa"
        description="Si está desactivada, el TopBar no se mostrará"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== Hero Form ====================
function HeroForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'hero');

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [primaryButtonText, setPrimaryButtonText] = useState('');
  const [primaryButtonLink, setPrimaryButtonLink] = useState('');
  const [secondaryButtonText, setSecondaryButtonText] = useState('');
  const [secondaryButtonLink, setSecondaryButtonLink] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [badge, setBadge] = useState('');
  const [trustIndicators, setTrustIndicators] = useState<{ value: string; label: string }[]>([
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
  ]);
  const [floatingBadge, setFloatingBadge] = useState('');
  const [priceOriginal, setPriceOriginal] = useState('');
  const [priceDiscounted, setPriceDiscounted] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<HeroConfig>(configs, 'hero');
    if (config) {
      setTitle(config.title || '');
      setSubtitle(config.subtitle || '');
      setPrimaryButtonText(config.primaryButtonText || '');
      setPrimaryButtonLink(config.primaryButtonLink || '');
      setSecondaryButtonText(config.secondaryButtonText || '');
      setSecondaryButtonLink(config.secondaryButtonLink || '');
      setBackgroundImage(config.backgroundImage || '');
      setBadge(config.badge || '');
      setTrustIndicators(config.trustIndicators || [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' },
      ]);
      setFloatingBadge(config.floatingBadge || '');
      setPriceOriginal(config.priceOriginal || '');
      setPriceDiscounted(config.priceDiscounted || '');
      setIsVisible(config.isVisible ?? true);
    }
    setIsActive(getConfigIsActive(configs, 'hero'));
  }, [configs]);

  const updateTrustIndicator = (index: number, field: 'value' | 'label', val: string) => {
    const updated = [...trustIndicators];
    updated[index] = { ...updated[index], [field]: val };
    setTrustIndicators(updated);
  };

  const handleSave = () => {
    const filledIndicators = trustIndicators.filter(i => i.value || i.label);
    const value: HeroConfig = {
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText: secondaryButtonText || undefined,
      secondaryButtonLink: secondaryButtonLink || undefined,
      backgroundImage: backgroundImage || undefined,
      badge: badge || undefined,
      trustIndicators: filledIndicators.length > 0 ? filledIndicators : undefined,
      floatingBadge: floatingBadge || undefined,
      priceOriginal: priceOriginal || undefined,
      priceDiscounted: priceDiscounted || undefined,
      isVisible,
    };

    if (existing) {
      updateMutation.mutate({ key: 'hero', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'hero', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Título"
        placeholder="Descubre tu estilo único"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Subtítulo"
        placeholder="Productos de alta calidad seleccionados para ti."
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        minRows={2}
      />
      <Group grow>
        <TextInput
          label="Texto botón principal"
          placeholder="Ver Colección"
          value={primaryButtonText}
          onChange={(e) => setPrimaryButtonText(e.target.value)}
        />
        <TextInput
          label="Link botón principal"
          placeholder="/products"
          value={primaryButtonLink}
          onChange={(e) => setPrimaryButtonLink(e.target.value)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Texto botón secundario"
          placeholder="Novedades (opcional)"
          value={secondaryButtonText}
          onChange={(e) => setSecondaryButtonText(e.target.value)}
        />
        <TextInput
          label="Link botón secundario"
          placeholder="/products?sortBy=createdAt&sortOrder=desc"
          value={secondaryButtonLink}
          onChange={(e) => setSecondaryButtonLink(e.target.value)}
        />
      </Group>
      <TextInput
        label="URL imagen de fondo"
        placeholder="https://images.unsplash.com/..."
        value={backgroundImage}
        onChange={(e) => setBackgroundImage(e.target.value)}
      />
      <TextInput
        label="Badge (etiqueta superior)"
        placeholder="Nueva Colección 2025"
        description="Texto que aparece en la etiqueta sobre el título"
        value={badge}
        onChange={(e) => setBadge(e.target.value)}
      />
      <Text size="sm" fw={500} mt="xs">Indicadores de confianza</Text>
      {trustIndicators.map((indicator, idx) => (
        <Group key={idx} grow>
          <TextInput
            label={`Valor #${idx + 1}`}
            placeholder={['10K+', '4.9', '24h'][idx] || ''}
            value={indicator.value}
            onChange={(e) => updateTrustIndicator(idx, 'value', e.target.value)}
          />
          <TextInput
            label={`Etiqueta #${idx + 1}`}
            placeholder={['Clientes felices', 'Calificación', 'Envío express'][idx] || ''}
            value={indicator.label}
            onChange={(e) => updateTrustIndicator(idx, 'label', e.target.value)}
          />
        </Group>
      ))}
      <TextInput
        label="Badge flotante"
        placeholder="-40% OFF"
        description="Texto del badge que flota junto a la imagen"
        value={floatingBadge}
        onChange={(e) => setFloatingBadge(e.target.value)}
      />
      <Group grow>
        <TextInput
          label="Precio original"
          placeholder="$299.00"
          description="Precio tachado"
          value={priceOriginal}
          onChange={(e) => setPriceOriginal(e.target.value)}
        />
        <TextInput
          label="Precio con descuento"
          placeholder="$179.00"
          description="Precio destacado"
          value={priceDiscounted}
          onChange={(e) => setPriceDiscounted(e.target.value)}
        />
      </Group>
      <Switch
        label="Sección visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />
      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== SpecialOffer Form ====================
function SpecialOfferForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'special-offer');

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [discountText, setDiscountText] = useState('');
  const [discountSubtext, setDiscountSubtext] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [trustText, setTrustText] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<SpecialOfferConfig>(configs, 'special-offer');
    if (config) {
      setTitle(config.title || '');
      setSubtitle(config.subtitle || '');
      setDescription(config.description || '');
      setButtonText(config.buttonText || '');
      setButtonLink(config.buttonLink || '');
      setDiscountText(config.discountText || '');
      setDiscountSubtext(config.discountSubtext || '');
      setEndDate(config.endDate || '');
      setIsVisible(config.isVisible ?? true);
      setBackgroundColor(config.backgroundColor || '');
      setTrustText(config.trustText || '');
    }
    setIsActive(getConfigIsActive(configs, 'special-offer'));
  }, [configs]);

  const handleSave = () => {
    const value: SpecialOfferConfig = {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      discountText: discountText || undefined,
      discountSubtext: discountSubtext || undefined,
      endDate: endDate || undefined,
      isVisible,
      backgroundColor: backgroundColor || undefined,
      trustText: trustText || undefined,
    };

    if (existing) {
      updateMutation.mutate({ key: 'special-offer', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'special-offer', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Subtítulo (badge)"
        placeholder="OFERTA ESPECIAL"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <TextInput
        label="Título"
        placeholder="Hasta 40% de descuento en productos seleccionados"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Descripción"
        placeholder="Aprovecha nuestra oferta de temporada. Stock limitado."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        minRows={2}
      />
      <Group grow>
        <TextInput
          label="Texto del botón"
          placeholder="Ver Ofertas"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
        />
        <TextInput
          label="Link del botón"
          placeholder="/products?onSale=true"
          value={buttonLink}
          onChange={(e) => setButtonLink(e.target.value)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Texto de descuento"
          placeholder="-40%"
          description="Texto grande que se muestra en la oferta"
          value={discountText}
          onChange={(e) => setDiscountText(e.target.value)}
        />
        <TextInput
          label="Subtexto de descuento"
          placeholder="En productos seleccionados"
          description="Texto debajo del descuento"
          value={discountSubtext}
          onChange={(e) => setDiscountSubtext(e.target.value)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Fecha de fin (opcional)"
          placeholder="2025-12-31"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <ColorInput
          label="Color de fondo"
          placeholder="Gradient por defecto"
          value={backgroundColor}
          onChange={setBackgroundColor}
        />
      </Group>
      <TextInput
        label="Texto de confianza"
        placeholder="Envío gratis en pedidos mayores a $50.000"
        description="Texto que aparece debajo del botón"
        value={trustText}
        onChange={(e) => setTrustText(e.target.value)}
      />
      <Switch
        label="Oferta visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />
      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== Testimonials Form ====================
function TestimonialsForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'testimonials');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<{ name: string; rating: number; text: string; product: string }[]>([]);
  const [averageRating, setAverageRating] = useState('');
  const [totalCustomers, setTotalCustomers] = useState('');
  const [recommendRate, setRecommendRate] = useState('');
  const [averageRatingLabel, setAverageRatingLabel] = useState('');
  const [totalCustomersLabel, setTotalCustomersLabel] = useState('');
  const [recommendRateLabel, setRecommendRateLabel] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<TestimonialsConfig>(configs, 'testimonials');
    if (config) {
      setSectionLabel(config.sectionLabel || '');
      setTitle(config.title || '');
      setSubtitle(config.subtitle || '');
      setIsVisible(config.isVisible ?? true);
      setItems(config.items || []);
      setAverageRating(config.metrics?.averageRating || '');
      setTotalCustomers(config.metrics?.totalCustomers || '');
      setRecommendRate(config.metrics?.recommendRate || '');
      setAverageRatingLabel(config.metrics?.averageRatingLabel || '');
      setTotalCustomersLabel(config.metrics?.totalCustomersLabel || '');
      setRecommendRateLabel(config.metrics?.recommendRateLabel || '');
    }
    setIsActive(getConfigIsActive(configs, 'testimonials'));
  }, [configs]);

  const addItem = () => {
    setItems([...items, { name: '', rating: 5, text: '', product: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSave = () => {
    const value: TestimonialsConfig = {
      sectionLabel: sectionLabel || undefined,
      title: title || undefined,
      subtitle: subtitle || undefined,
      isVisible,
      items: items.length > 0 ? items : [],
      metrics: (averageRating || totalCustomers || recommendRate || averageRatingLabel || totalCustomersLabel || recommendRateLabel)
        ? {
            averageRating: averageRating || '4.9',
            totalCustomers: totalCustomers || '10K+',
            recommendRate: recommendRate || '98%',
            averageRatingLabel: averageRatingLabel || undefined,
            totalCustomersLabel: totalCustomersLabel || undefined,
            recommendRateLabel: recommendRateLabel || undefined,
          }
        : undefined,
    };

    if (existing) {
      updateMutation.mutate({ key: 'testimonials', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'testimonials', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Etiqueta de sección"
        placeholder="Testimonios"
        value={sectionLabel}
        onChange={(e) => setSectionLabel(e.target.value)}
      />
      <TextInput
        label="Título"
        placeholder="Lo Que Dicen Nuestros Clientes"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        label="Subtítulo"
        placeholder="+10,000 clientes satisfechos nos respaldan"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
      />
      <Switch
        label="Sección visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />

      <Text size="sm" fw={500} mt="md">Métricas</Text>
      <Group grow>
        <TextInput
          label="Calificación promedio"
          placeholder="4.9"
          value={averageRating}
          onChange={(e) => setAverageRating(e.target.value)}
        />
        <TextInput
          label="Total clientes"
          placeholder="10K+"
          value={totalCustomers}
          onChange={(e) => setTotalCustomers(e.target.value)}
        />
        <TextInput
          label="Tasa de recomendación"
          placeholder="98%"
          value={recommendRate}
          onChange={(e) => setRecommendRate(e.target.value)}
        />
      </Group>
      <Text size="sm" fw={500} mt="xs">Etiquetas de métricas</Text>
      <Group grow>
        <TextInput
          label="Etiqueta calificación"
          placeholder="Calificación promedio"
          value={averageRatingLabel}
          onChange={(e) => setAverageRatingLabel(e.target.value)}
        />
        <TextInput
          label="Etiqueta clientes"
          placeholder="Clientes felices"
          value={totalCustomersLabel}
          onChange={(e) => setTotalCustomersLabel(e.target.value)}
        />
        <TextInput
          label="Etiqueta recomendación"
          placeholder="Recomendarían"
          value={recommendRateLabel}
          onChange={(e) => setRecommendRateLabel(e.target.value)}
        />
      </Group>

      <Group justify="space-between" mt="md">
        <Text size="sm" fw={500}>Testimonios ({items.length})</Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={addItem}
        >
          Agregar testimonio
        </Button>
      </Group>

      {items.map((item, index) => (
        <Paper key={index} p="md" withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500} c="dimmed">Testimonio #{index + 1}</Text>
              <ActionIcon color="red" variant="subtle" onClick={() => removeItem(index)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
            <Group grow>
              <TextInput
                label="Nombre"
                placeholder="María García"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
              />
              <NumberInput
                label="Rating"
                min={1}
                max={5}
                value={item.rating}
                onChange={(val) => updateItem(index, 'rating', val || 5)}
              />
            </Group>
            <Textarea
              label="Texto"
              placeholder="La calidad superó mis expectativas..."
              value={item.text}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              minRows={2}
            />
            <TextInput
              label="Producto"
              placeholder="Auriculares Pro X"
              value={item.product}
              onChange={(e) => updateItem(index, 'product', e.target.value)}
            />
          </Stack>
        </Paper>
      ))}

      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== ValueProposition Form ====================
function ValuePropositionForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'value-proposition');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<{ icon: string; title: string; description: string; colorScheme: 'orchid' | 'jade' }[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<ValuePropositionConfig>(configs, 'value-proposition');
    if (config) {
      setSectionLabel(config.sectionLabel || '');
      setTitle(config.title || '');
      setIsVisible(config.isVisible ?? true);
      setItems(config.items || []);
    }
    setIsActive(getConfigIsActive(configs, 'value-proposition'));
  }, [configs]);

  const addItem = () => {
    setItems([...items, { icon: 'IconTruck', title: '', description: '', colorScheme: 'orchid' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSave = () => {
    const value: ValuePropositionConfig = {
      sectionLabel: sectionLabel || undefined,
      title: title || undefined,
      isVisible,
      items: items.length > 0 ? items : [],
    };

    if (existing) {
      updateMutation.mutate({ key: 'value-proposition', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'value-proposition', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Etiqueta de sección"
        placeholder="Nuestra Promesa"
        value={sectionLabel}
        onChange={(e) => setSectionLabel(e.target.value)}
      />
      <TextInput
        label="Título"
        placeholder="¿Por Qué Elegirnos?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Switch
        label="Sección visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />

      <Group justify="space-between" mt="md">
        <Text size="sm" fw={500}>Beneficios ({items.length})</Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={addItem}
        >
          Agregar beneficio
        </Button>
      </Group>

      {items.map((item, index) => (
        <Paper key={index} p="md" withBorder>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500} c="dimmed">Beneficio #{index + 1}</Text>
              <ActionIcon color="red" variant="subtle" onClick={() => removeItem(index)}>
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
            <Group grow>
              <Select
                label="Ícono"
                data={iconSelectData}
                value={item.icon}
                onChange={(val) => updateItem(index, 'icon', val || 'IconTruck')}
                searchable
              />
              <Select
                label="Esquema de color"
                data={[
                  { value: 'orchid', label: 'Orchid (Violeta)' },
                  { value: 'jade', label: 'Jade (Verde)' },
                ]}
                value={item.colorScheme}
                onChange={(val) => updateItem(index, 'colorScheme', val || 'orchid')}
              />
            </Group>
            <TextInput
              label="Título"
              placeholder="Envío Express"
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
            />
            <TextInput
              label="Descripción"
              placeholder="Gratis en pedidos mayores a $50.000"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
            />
          </Stack>
        </Paper>
      ))}

      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== TrustBar Form ====================
function TrustBarForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'trust-bar');

  const [isVisible, setIsVisible] = useState(true);
  const [items, setItems] = useState<{ icon: string; text: string }[]>([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<TrustBarConfig>(configs, 'trust-bar');
    if (config) {
      setIsVisible(config.isVisible ?? true);
      setItems(config.items || []);
    }
    setIsActive(getConfigIsActive(configs, 'trust-bar'));
  }, [configs]);

  const addItem = () => {
    setItems([...items, { icon: 'IconTruckDelivery', text: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSave = () => {
    const value: TrustBarConfig = {
      isVisible,
      items: items.length > 0 ? items : [],
    };

    if (existing) {
      updateMutation.mutate({ key: 'trust-bar', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'trust-bar', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <Switch
        label="Barra visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />

      <Group justify="space-between" mt="md">
        <Text size="sm" fw={500}>Items de confianza ({items.length})</Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={addItem}
        >
          Agregar item
        </Button>
      </Group>

      {items.map((item, index) => (
        <Paper key={index} p="md" withBorder>
          <Group align="flex-end" gap="sm">
            <Select
              label="Ícono"
              data={iconSelectData}
              value={item.icon}
              onChange={(val) => updateItem(index, 'icon', val || 'IconTruckDelivery')}
              searchable
              style={{ flex: 1 }}
            />
            <TextInput
              label="Texto"
              placeholder="Envío Express 24-48h"
              value={item.text}
              onChange={(e) => updateItem(index, 'text', e.target.value)}
              style={{ flex: 2 }}
            />
            <ActionIcon color="red" variant="subtle" onClick={() => removeItem(index)} mb={2}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Paper>
      ))}

      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== ProductCarousels Form ====================
function ProductCarouselsForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'product-carousels');

  const [bsTitle, setBsTitle] = useState('');
  const [bsSubtitle, setBsSubtitle] = useState('');
  const [bsVisible, setBsVisible] = useState(true);
  const [npTitle, setNpTitle] = useState('');
  const [npSubtitle, setNpSubtitle] = useState('');
  const [npVisible, setNpVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<ProductCarouselsConfig>(configs, 'product-carousels');
    if (config) {
      setBsTitle(config.bestSellers?.title || '');
      setBsSubtitle(config.bestSellers?.subtitle || '');
      setBsVisible(config.bestSellers?.isVisible ?? true);
      setNpTitle(config.newProducts?.title || '');
      setNpSubtitle(config.newProducts?.subtitle || '');
      setNpVisible(config.newProducts?.isVisible ?? true);
    }
    setIsActive(getConfigIsActive(configs, 'product-carousels'));
  }, [configs]);

  const handleSave = () => {
    const value: ProductCarouselsConfig = {
      bestSellers: { title: bsTitle || 'Los más vendidos', subtitle: bsSubtitle || undefined, isVisible: bsVisible },
      newProducts: { title: npTitle || 'Novedades', subtitle: npSubtitle || undefined, isVisible: npVisible },
    };

    if (existing) {
      updateMutation.mutate({ key: 'product-carousels', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'product-carousels', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <Text size="sm" fw={500}>Carrusel: Más Vendidos</Text>
      <Group grow>
        <TextInput
          label="Título"
          placeholder="Los más vendidos"
          value={bsTitle}
          onChange={(e) => setBsTitle(e.target.value)}
        />
        <TextInput
          label="Subtítulo"
          placeholder="Lo que otros están comprando"
          value={bsSubtitle}
          onChange={(e) => setBsSubtitle(e.target.value)}
        />
      </Group>
      <Switch
        label="Carrusel más vendidos visible"
        checked={bsVisible}
        onChange={(e) => setBsVisible(e.currentTarget.checked)}
      />

      <Text size="sm" fw={500} mt="md">Carrusel: Novedades</Text>
      <Group grow>
        <TextInput
          label="Título"
          placeholder="Novedades"
          value={npTitle}
          onChange={(e) => setNpTitle(e.target.value)}
        />
        <TextInput
          label="Subtítulo"
          placeholder="Recién llegados a la tienda"
          value={npSubtitle}
          onChange={(e) => setNpSubtitle(e.target.value)}
        />
      </Group>
      <Switch
        label="Carrusel novedades visible"
        checked={npVisible}
        onChange={(e) => setNpVisible(e.currentTarget.checked)}
      />

      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== Newsletter Form ====================
function NewsletterForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'newsletter');

  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [successTitle, setSuccessTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [trustText, setTrustText] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<NewsletterConfig>(configs, 'newsletter');
    if (config) {
      setBadge(config.badge || '');
      setTitle(config.title || '');
      setDescription(config.description || '');
      setButtonText(config.buttonText || '');
      setSuccessTitle(config.successTitle || '');
      setSuccessMessage(config.successMessage || '');
      setTrustText(config.trustText || '');
      setBenefits(config.benefits || []);
      setIsVisible(config.isVisible ?? true);
    }
    setIsActive(getConfigIsActive(configs, 'newsletter'));
  }, [configs]);

  const addBenefit = () => {
    setBenefits([...benefits, '']);
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const updateBenefit = (index: number, value: string) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const handleSave = () => {
    const value: NewsletterConfig = {
      badge: badge || undefined,
      title: title || undefined,
      description: description || undefined,
      buttonText: buttonText || undefined,
      successTitle: successTitle || undefined,
      successMessage: successMessage || undefined,
      trustText: trustText || undefined,
      benefits: benefits.length > 0 ? benefits.filter(Boolean) : undefined,
      isVisible,
    };

    if (existing) {
      updateMutation.mutate({ key: 'newsletter', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'newsletter', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Badge"
        placeholder="EXCLUSIVO PARA MIEMBROS"
        value={badge}
        onChange={(e) => setBadge(e.target.value)}
      />
      <TextInput
        label="Título"
        placeholder="Únete al Círculo Interior"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Descripción"
        placeholder="Recibe acceso anticipado... Usa **texto** para negritas."
        description="Soporta **negritas** con doble asterisco"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        minRows={2}
      />
      <Group grow>
        <TextInput
          label="Texto del botón"
          placeholder="Unirme"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value)}
        />
        <TextInput
          label="Texto de confianza"
          placeholder="Sin spam. Cancela cuando quieras."
          value={trustText}
          onChange={(e) => setTrustText(e.target.value)}
        />
      </Group>
      <Group grow>
        <TextInput
          label="Título de éxito"
          placeholder="¡Bienvenido al círculo!"
          value={successTitle}
          onChange={(e) => setSuccessTitle(e.target.value)}
        />
        <TextInput
          label="Mensaje de éxito"
          placeholder="Revisa tu correo para confirmar tu suscripción."
          value={successMessage}
          onChange={(e) => setSuccessMessage(e.target.value)}
        />
      </Group>
      <Switch
        label="Sección visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />

      <Group justify="space-between" mt="md">
        <Text size="sm" fw={500}>Beneficios ({benefits.length})</Text>
        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
          onClick={addBenefit}
        >
          Agregar beneficio
        </Button>
      </Group>

      {benefits.map((benefit, index) => (
        <Group key={index} gap="sm">
          <TextInput
            placeholder="10% en primera compra"
            value={benefit}
            onChange={(e) => updateBenefit(index, e.target.value)}
            style={{ flex: 1 }}
          />
          <ActionIcon color="red" variant="subtle" onClick={() => removeBenefit(index)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      ))}

      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== CategoryGrid Form ====================
function CategoryGridForm({ configs }: { configs: SiteConfig[] | undefined }) {
  const createMutation = useCreateSiteConfig();
  const updateMutation = useUpdateSiteConfig();
  const existing = configExists(configs, 'category-grid');

  const [sectionLabel, setSectionLabel] = useState('');
  const [title, setTitle] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const config = getConfigValue<CategoryGridConfig>(configs, 'category-grid');
    if (config) {
      setSectionLabel(config.sectionLabel || '');
      setTitle(config.title || '');
      setIsVisible(config.isVisible ?? true);
    }
    setIsActive(getConfigIsActive(configs, 'category-grid'));
  }, [configs]);

  const handleSave = () => {
    const value: CategoryGridConfig = {
      sectionLabel: sectionLabel || undefined,
      title: title || undefined,
      isVisible,
    };

    if (existing) {
      updateMutation.mutate({ key: 'category-grid', data: { value, isActive } });
    } else {
      createMutation.mutate({ key: 'category-grid', value, isActive });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Stack>
      <TextInput
        label="Etiqueta de sección"
        placeholder="Colecciones"
        value={sectionLabel}
        onChange={(e) => setSectionLabel(e.target.value)}
      />
      <TextInput
        label="Título"
        placeholder="Explora por Categoría"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Switch
        label="Sección visible"
        checked={isVisible}
        onChange={(e) => setIsVisible(e.currentTarget.checked)}
      />
      <Switch
        label="Configuración activa"
        checked={isActive}
        onChange={(e) => setIsActive(e.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button
          leftSection={<IconDeviceFloppy size={16} />}
          onClick={handleSave}
          loading={isPending}
        >
          {existing ? 'Guardar Cambios' : 'Crear Configuración'}
        </Button>
      </Group>
    </Stack>
  );
}

// ==================== Config Status Badge ====================
function ConfigBadge({ configs, configKey }: { configs: SiteConfig[] | undefined; configKey: string }) {
  return configExists(configs, configKey)
    ? <Badge size="sm" color="green" variant="light">Configurada</Badge>
    : <Badge size="sm" color="orange" variant="light">Sin configurar</Badge>;
}

// ==================== Main Page ====================
export default function AdminSiteConfigPage() {
  const { data: configs, isLoading } = useSiteConfigsAdmin();

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="lg">Configuración del Sitio</Title>
        <Stack>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} radius="md" />
          ))}
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <div>
            <Title order={1}>Configuración del Sitio</Title>
            <Text c="dimmed">Personaliza las secciones del homepage</Text>
          </div>
        </Group>

        <Accordion variant="separated" defaultValue="general">
          <Accordion.Item value="general">
            <Accordion.Control icon={<IconBuilding size={20} />}>
              <Group>
                <Text fw={500}>General</Text>
                <ConfigBadge configs={configs} configKey="general" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <GeneralForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="topbar">
            <Accordion.Control icon={<IconBell size={20} />}>
              <Group>
                <Text fw={500}>Barra Superior (TopBar)</Text>
                <ConfigBadge configs={configs} configKey="topbar" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <TopBarForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="hero">
            <Accordion.Control icon={<IconPhoto size={20} />}>
              <Group>
                <Text fw={500}>Hero Section</Text>
                <ConfigBadge configs={configs} configKey="hero" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <HeroForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="special-offer">
            <Accordion.Control icon={<IconFlame size={20} />}>
              <Group>
                <Text fw={500}>Oferta Especial</Text>
                <ConfigBadge configs={configs} configKey="special-offer" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <SpecialOfferForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="testimonials">
            <Accordion.Control icon={<IconMessageCircle size={20} />}>
              <Group>
                <Text fw={500}>Testimonios</Text>
                <ConfigBadge configs={configs} configKey="testimonials" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <TestimonialsForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="value-proposition">
            <Accordion.Control icon={<IconDiamond size={20} />}>
              <Group>
                <Text fw={500}>Propuesta de Valor</Text>
                <ConfigBadge configs={configs} configKey="value-proposition" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <ValuePropositionForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="trust-bar">
            <Accordion.Control icon={<IconShieldCheck size={20} />}>
              <Group>
                <Text fw={500}>Barra de Confianza</Text>
                <ConfigBadge configs={configs} configKey="trust-bar" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <TrustBarForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="category-grid">
            <Accordion.Control icon={<IconCategory size={20} />}>
              <Group>
                <Text fw={500}>Grilla de Categorías</Text>
                <ConfigBadge configs={configs} configKey="category-grid" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <CategoryGridForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="product-carousels">
            <Accordion.Control icon={<IconBoxMultiple size={20} />}>
              <Group>
                <Text fw={500}>Carruseles de Productos</Text>
                <ConfigBadge configs={configs} configKey="product-carousels" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <ProductCarouselsForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="newsletter">
            <Accordion.Control icon={<IconMail size={20} />}>
              <Group>
                <Text fw={500}>Newsletter</Text>
                <ConfigBadge configs={configs} configKey="newsletter" />
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <NewsletterForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
}
