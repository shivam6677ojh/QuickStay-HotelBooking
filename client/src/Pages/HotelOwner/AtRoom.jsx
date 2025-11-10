import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { roomService } from '../../api/services'
import { toast } from 'react-toastify'

const Atroom = () => {
  const navigate = useNavigate()
  const { id } = useParams() // For edit mode
  const { isSignedIn } = useUser()
  const [loading, setLoading] = useState(false)
  const [hotelId, setHotelId] = useState('')
  
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  const [inputs, setInputs] = useState({
    roomType: '',
    pricePerNight: '',
    capacity: 2,
    description: '',
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Free Services': false,
      'Mountain view': false,
      'Pool access': false
    }
  })

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/')
      return
    }
    
    // Skip hotel fetch for now - backend will use first hotel automatically
    setHotelId('temp-id') // Set a temp ID to bypass validation

    // If editing, fetch room data
    if (id) {
      const fetchRoom = async () => {
        try {
          const response = await roomService.getRoomById(id)
          const room = response.room
          
          setInputs({
            roomType: room.roomType || '',
            pricePerNight: room.pricePerNignt || room.pricePerNight || '',
            capacity: room.capacity || 2,
            description: room.description || '',
            amenities: {
              'Free Wifi': room.amenities?.includes('Free Wifi') || false,
              'Free Breakfast': room.amenities?.includes('Free Breakfast') || false,
              'Free Services': room.amenities?.includes('Free Services') || false,
              'Mountain view': room.amenities?.includes('Mountain view') || false,
              'Pool access': room.amenities?.includes('Pool access') || false
            }
          })
          
          // Note: Can't pre-populate file inputs, but could show existing image URLs
        } catch (error) {
          console.error('Error fetching room:', error)
          toast.error('Failed to load room data')
        }
      }
      fetchRoom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isSignedIn])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!hotelId) {
      toast.error('Hotel not found. Please create a hotel first.')
      return
    }

    if (!inputs.roomType || !inputs.pricePerNight) {
      toast.error('Please fill in all required fields')
      return
    }

    const hasAtLeastOneImage = Object.values(images).some(img => img !== null)
    if (!hasAtLeastOneImage && !id) {
      toast.error('Please upload at least one image')
      return
    }

    try {
      setLoading(true)
      
      const formData = new FormData()
      formData.append('hotel', hotelId)
      formData.append('roomType', inputs.roomType)
      formData.append('pricePerNight', inputs.pricePerNight)
      formData.append('capacity', inputs.capacity)
      formData.append('description', inputs.description)
      
      // Add selected amenities
      const selectedAmenities = Object.keys(inputs.amenities).filter(
        amenity => inputs.amenities[amenity]
      )
      selectedAmenities.forEach(amenity => {
        formData.append('amenities[]', amenity)
      })
      
      // Add images
      Object.values(images).forEach(image => {
        if (image) {
          formData.append('images', image)
        }
      })

      let response
      if (id) {
        // Update existing room
        response = await roomService.updateRoom(id, formData)
        toast.success('Room updated successfully!')
      } else {
        // Create new room
        response = await roomService.createRoom(formData)
        toast.success('Room added successfully!')
      }

      if (response) {
        // Reset form
        setInputs({
          roomType: '',
          pricePerNight: '',
          capacity: 2,
          description: '',
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Free Services': false,
            'Mountain view': false,
            'Pool access': false
          }
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
        
        setTimeout(() => {
          navigate('/owner/list-room')
        }, 1500)
      }

    } catch (error) {
      console.error('Error saving room:', error)
      toast.error(error.response?.data?.message || 'Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Title 
        align='left' 
        font='outfit' 
        title={id ? 'Edit Room' : 'Add New Room'} 
        subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.'
      />
      
      {/* Upload Area For Images */}
      <p className='text-gray-800 dark:text-gray-200 mt-10 font-medium'>Images *</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage${key}`} key={key} className='relative group'>
            <img
              className='max-h-24 cursor-pointer opacity-80 hover:opacity-100 transition-all border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800'
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} 
              alt="Upload" 
            />
            {images[key] && (
              <button
                type='button'
                onClick={(e) => {
                  e.preventDefault()
                  setImages({ ...images, [key]: null })
                }}
                className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer'
              >
                ×
              </button>
            )}
            <input 
              type="file" 
              accept='image/*' 
              id={`roomImage${key}`} 
              hidden
              onChange={e => setImages({ ...images, [key]: e.target.files[0] })} 
            />
          </label>
        ))}
      </div>

      {/* Room Details */}
      <div className='w-full flex max-sm:flex-col sm:gap-6 mt-6'>
        <div className='flex-1 max-w-64'>
          <p className='text-gray-800 dark:text-gray-200 mt-4 font-medium'>Room Type *</p>
          <select 
            value={inputs.roomType} 
            onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
            className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mt-1 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-500 outline-none'
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
          </select>
        </div>

        <div>
          <p className='mt-4 text-gray-800 dark:text-gray-200 font-medium'>
            Price * <span className='text-xs text-gray-500 dark:text-gray-400'>/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mt-1 rounded-lg p-2.5 w-32 focus:ring-2 focus:ring-blue-500 outline-none'
            value={inputs.pricePerNight}
            onChange={e => setInputs({ ...inputs, pricePerNight: e.target.value })}
            required
            min="0"
          />
        </div>

        <div>
          <p className='mt-4 text-gray-800 dark:text-gray-200 font-medium'>Capacity</p>
          <input
            type="number"
            placeholder="2"
            className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 mt-1 rounded-lg p-2.5 w-24 focus:ring-2 focus:ring-blue-500 outline-none'
            value={inputs.capacity}
            onChange={e => setInputs({ ...inputs, capacity: e.target.value })}
            min="1"
            max="10"
          />
        </div>
      </div>

      {/* Description */}
      <div className='mt-6'>
        <p className='text-gray-800 dark:text-gray-200 mb-1 font-medium'>Description</p>
        <textarea
          className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg p-2.5 w-full max-w-2xl focus:ring-2 focus:ring-blue-500 outline-none'
          rows="4"
          placeholder='Describe the room features, view, size, etc.'
          value={inputs.description}
          onChange={e => setInputs({ ...inputs, description: e.target.value })}
        />
      </div>

      {/* Amenities */}
      <p className='text-gray-800 dark:text-gray-200 mt-3 mb-2 font-medium'>Amenities</p>
      <div className='flex flex-wrap gap-4 text-gray-700 dark:text-gray-300 max-w-2xl'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index} className='flex items-center'>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
              className='w-4 h-4 text-blue-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500'
            />
            <label htmlFor={`amenities${index + 1}`} className='ml-2 cursor-pointer'> 
              {amenity}
            </label>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className='flex gap-4 mt-8'>
        <button 
          type='submit'
          disabled={loading}
          className='btn-brand text-white rounded-lg py-2.5 px-8 cursor-pointer font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Saving...' : id ? 'Update Room' : 'Add Room'}
        </button>
        
        <button
          type='button'
          onClick={() => navigate('/owner/list-room')}
          className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg py-2.5 px-8 cursor-pointer font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all'
        >
          Cancel
        </button>
      </div>

    </form>
  )
}

export default Atroom