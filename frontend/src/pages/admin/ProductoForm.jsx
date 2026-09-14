import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { productSchema } from '../../schemas/productSchema';
import { fetchAdminProduct, createProduct, updateProduct } from '../../lib/api';
import ImageUploader from '../../components/admin/ImageUploader';

const CATEGORIAS = [
  { value: 'sol', label: 'Anteojos de Sol' },
  { value: 'contacto', label: 'Lentes de Contacto' },
  { value: 'recetados', label: 'Lentes Recetados' },
  { value: 'armazones', label: 'Armazones de Receta' },
  { value: 'liquidos', label: 'Líquidos' },
  { value: 'colgantes', label: 'Colgantes' },
];
const GENEROS = ['dama', 'caballero', 'niños'];
const TIPOS_CONTACTO = ['diarias', 'mensuales', 'toricas', 'color'];
const TIPOS_LENTE_RECETADO = ['multifocales', 'bifocales', 'ocupacionales', 'monofocales'];

const emptyValues = {
  nombre: '',
  categoria: 'sol',
  subcategoriaGenero: '',
  tipoContacto: '',
  tipoLenteRecetado: '',
  marca: '',
  precio: 0,
  precioDescuento: '',
  stock: 0,
  umbralStockBajo: 5,
  imagenes: [],
  descripcion: '',
  materiales: '',
  proteccionUV: false,
  irrompible: false,
  colorArmazon: '',
  activo: true,
};

export default function ProductoForm() {
  const { id } = useParams();
  const isNew = !id || id === 'nuevo';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(productSchema), defaultValues: emptyValues });

  const categoria = watch('categoria');

  useEffect(() => {
    if (isNew) return;
    fetchAdminProduct(id).then((product) => {
      reset({
        ...emptyValues,
        ...product,
        subcategoriaGenero: product.subcategoriaGenero || '',
        tipoContacto: product.tipoContacto || '',
        tipoLenteRecetado: product.tipoLenteRecetado || '',
        precioDescuento: product.precioDescuento ?? '',
      });
      setLoading(false);
    });
  }, [id, isNew, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      precioDescuento: values.precioDescuento === '' ? null : values.precioDescuento,
      subcategoriaGenero: values.subcategoriaGenero || null,
      tipoContacto: values.tipoContacto || null,
      tipoLenteRecetado: values.tipoLenteRecetado || null,
    };

    try {
      if (isNew) {
        await createProduct(payload);
      } else {
        await updateProduct(id, payload);
      }
      Swal.fire({
        icon: 'success',
        title: isNew ? 'Producto creado' : 'Producto actualizado',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/admin/productos');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos guardar el producto',
        text: err.response?.data?.message || 'Revisá los datos e intentá de nuevo',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  if (loading) return <p className="text-sol-blanco/60">Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-2xl uppercase mb-6">
        {isNew ? 'Nuevo producto' : 'Editar producto'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Nombre" error={errors.nombre?.message}>
          <input {...register('nombre')} className="input" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Categoría" error={errors.categoria?.message}>
            <select {...register('categoria')} className="input">
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Marca" error={errors.marca?.message}>
            <input {...register('marca')} className="input" />
          </Field>
        </div>

        {categoria === 'contacto' && (
          <Field label="Tipo (opcional)" error={errors.tipoContacto?.message}>
            <select {...register('tipoContacto')} className="input">
              <option value="">Elegí un tipo</option>
              {TIPOS_CONTACTO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}

        {categoria === 'recetados' && (
          <Field label="Tipo de lente" error={errors.tipoLenteRecetado?.message}>
            <select {...register('tipoLenteRecetado')} className="input">
              <option value="">Elegí un tipo</option>
              {TIPOS_LENTE_RECETADO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
        )}

        {['sol', 'armazones'].includes(categoria) && (
          <Field label="Género / edad (opcional)" error={errors.subcategoriaGenero?.message}>
            <select {...register('subcategoriaGenero')} className="input">
              <option value="">Elegí una opción</option>
              {GENEROS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Precio" error={errors.precio?.message}>
            <input type="number" step="0.01" {...register('precio')} className="input" />
          </Field>
          <Field label="Precio con descuento (opcional)" error={errors.precioDescuento?.message}>
            <input type="number" step="0.01" {...register('precioDescuento')} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Stock" error={errors.stock?.message}>
            <input type="number" {...register('stock')} className="input" />
          </Field>
          <Field label="Umbral de stock bajo" error={errors.umbralStockBajo?.message}>
            <input type="number" {...register('umbralStockBajo')} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Color de armazón">
            <input {...register('colorArmazon')} className="input" />
          </Field>
          <Field label="Materiales">
            <input {...register('materiales')} className="input" />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea {...register('descripcion')} rows={3} className="input" />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('proteccionUV')} />
          Con protección UV
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('irrompible')} />
          Armazón irrompible (para niños)
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('activo')} />
          Producto activo (visible en el catálogo)
        </label>

        <Field label="Imágenes" error={errors.imagenes?.message}>
          <Controller
            name="imagenes"
            control={control}
            render={({ field }) => (
              <ImageUploader images={field.value} onChange={field.onChange} tipo="productos" />
            )}
          />
        </Field>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : isNew ? 'Crear producto' : 'Guardar cambios'}
        </motion.button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-sol-rojo mt-1">{error}</p>}
    </div>
  );
}
