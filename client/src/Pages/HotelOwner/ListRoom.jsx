import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Title from '../../components/Title'
import { roomService } from '../../api/services'
import { toast } from 'react-toastify'

const ListRoom = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useUser()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/')
      return
    }
    // Add small delay to ensure auth token is set up
    const timer = setTimeout(() => {
      fetchRooms()
    }, 100)
    
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      console.log('Fetching owner rooms...')
      const response = await roomService.getOwnerRooms()
      console.log('Rooms response:', response)
      setRooms(response.rooms || [])
    } catch (error) {
      console.error('Error fetching rooms:', error)
      if (error.response?.status === 401) {
        toast.error('Authentication required. Please sign in again.')
      } else {
        toast.error(error.response?.data?.message || 'Failed to load rooms')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (roomId, currentStatus) => {
    try {
      await roomService.toggleAvailability(roomId)
      
      // Update local state
      setRooms(rooms.map(room => 
        room._id === roomId 
          ? { ...room, isAvailable: !currentStatus }
          : room
      ))
      
      toast.success(`Room ${!currentStatus ? 'activated' : 'deactivated'}`)
    } catch (error) {
      console.error('Error toggling availability:', error)
      toast.error('Failed to update room status')
    }
  }

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(roomId)
      await roomService.deleteRoom(roomId)
      setRooms(rooms.filter(room => room._id !== roomId))
      toast.success('Room deleted successfully')
    } catch (error) {
      console.error('Error deleting room:', error)
      toast.error('Failed to delete room')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (roomId) => {
    navigate(`/owner/edit-room/${roomId}`)
  }

  if (loading) {
    return (
      <div>
        <Title 
          align='left' 
          font='outfit' 
          title='Room Listings' 
          subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.' 
        />
        <div className='text-gray-500 mt-8'>Loading rooms...</div>
      </div>
    )
  }

  return (
    <div>
      <Title 
        align='left' 
        font='outfit' 
        title='Room Listings' 
        subTitle='View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users.' 
      />
      
      <div className='flex justify-between items-center mt-8 mb-4'>
        <p className='text-gray-700 dark:text-gray-200 font-medium'>All Rooms ({rooms.length})</p>
        <button
          onClick={() => navigate('/owner/add-room')}
          className='px-4 py-2 btn-brand text-white rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer'
        >
          + Add New Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className='bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center'>
          <p className='text-gray-500 dark:text-gray-400 mb-4'>No rooms listed yet</p>
          <button
            onClick={() => navigate('/owner/add-room')}
            className='px-6 py-2 btn-brand text-white rounded-lg font-semibold hover:opacity-90 transition-all cursor-pointer'
          >
            + Add Your First Room
          </button>
        </div>
      ) : (
        <div className='w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden'>
          <div className='overflow-x-auto max-h-96 overflow-y-auto'>
            <table className='w-full'>
              <thead className='bg-gray-100 dark:bg-gray-800 sticky top-0'>
                <tr>
                  <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-left'>Room Type</th>
                  <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-left max-sm:hidden'>Amenities</th>
                  <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-center'>Price/Night</th>
                  <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-center'>Status</th>
                  <th className='py-3 px-4 text-gray-800 dark:text-gray-200 font-medium text-center'>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room._id} className='hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'>
                    <td className='py-3 px-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700'>
                      <div className='flex items-center gap-3'>
                        {room.images?.[0] && (
                          <img 
                            src={room.images[0]} 
                            alt={room.roomType}
                            className='w-12 h-12 object-cover rounded'
                          />
                        )}
                        <span className='font-medium'>{room.roomType}</span>
                      </div>
                    </td>
                    
                    <td className='py-3 px-4 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 max-sm:hidden'>
                      <div className='text-xs'>
                        {room.amenities?.slice(0, 2).join(', ')}
                        {room.amenities?.length > 2 && ` +${room.amenities.length - 2}`}
                      </div>
                    </td>
                    
                    <td className='py-3 px-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 text-center font-semibold'>
                      ${room.pricePerNignt || room.pricePerNight}
                    </td>
                    
                    <td className='py-3 px-4 border-t border-gray-200 dark:border-gray-700'>
                      <div className='flex justify-center'>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input 
                            type="checkbox" 
                            className='sr-only peer' 
                            checked={room.isAvailable}
                            onChange={() => handleToggleAvailability(room._id, room.isAvailable)}
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></span>
                        </label>
                      </div>
                    </td>
                    
                    <td className='py-3 px-4 border-t border-gray-200 dark:border-gray-700'>
                      <div className='flex gap-2 justify-center'>
                        <button
                          onClick={() => handleEdit(room._id)}
                          className='px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-all cursor-pointer'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          disabled={deletingId === room._id}
                          className='px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                        >
                          {deletingId === room._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListRoom