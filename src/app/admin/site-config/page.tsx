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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconBell,
  IconPhoto,
  IconFlame,
  IconDeviceFloppy,
  IconBuilding,
} from '@tabler/icons-react';
import { useSiteConfigsAdmin, useCreateSiteConfig, useUpdateSiteConfig } from '@/hooks/useSiteConfig';
import { SiteConfig, GeneralConfig, TopBarConfig, HeroConfig, SpecialOfferConfig } from '@/types';

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
      setIsVisible(config.isVisible ?? true);
    }
    setIsActive(getConfigIsActive(configs, 'hero'));
  }, [configs]);

  const handleSave = () => {
    const value: HeroConfig = {
      title,
      subtitle,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText: secondaryButtonText || undefined,
      secondaryButtonLink: secondaryButtonLink || undefined,
      backgroundImage: backgroundImage || undefined,
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
                {configExists(configs, 'general') && (
                  <Badge size="sm" color="green" variant="light">Configurada</Badge>
                )}
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
                {configExists(configs, 'topbar') && (
                  <Badge size="sm" color="green" variant="light">Configurada</Badge>
                )}
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
                {configExists(configs, 'hero') && (
                  <Badge size="sm" color="green" variant="light">Configurada</Badge>
                )}
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
                {configExists(configs, 'special-offer') && (
                  <Badge size="sm" color="green" variant="light">Configurada</Badge>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <SpecialOfferForm configs={configs} />
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
}
