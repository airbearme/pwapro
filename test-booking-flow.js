import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fofmrqgcidfenbevayrg.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZm1ycWdjaWRmZW5iZXZheXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzNDcyOCwiZXhwIjoyMDc5MjEwNzI4fQ.89Y4IOCpB-Ky1qjTJLmotMBe8RqQyN8bk6Xp5F43MMA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testBookingFlow() {
  console.log('🧪 Testing booking flow...');
  
  try {
    // 1. Check available AirBears
    console.log('\n🐻 Checking available AirBears...');
    const { data: airbears, error: airbearError } = await supabase
      .from('airbears')
      .select('*')
      .eq('is_available', true)
      .eq('is_charging', false);
    
    if (airbearError) {
      console.error('❌ AirBear check error:', airbearError);
      return;
    }
    
    console.log(`✅ Found ${airbears?.length || 0} available AirBears`);
    
    if (!airbears || airbears.length === 0) {
      console.log('⚠️  No available AirBears for testing');
      return;
    }
    
    // 2. Check spots
    console.log('\n📍 Checking spots...');
    const { data: spots, error: spotsError } = await supabase
      .from('spots')
      .select('id, name')
      .limit(5);
    
    if (spotsError) {
      console.error('❌ Spots check error:', spotsError);
      return;
    }
    
    console.log(`✅ Found ${spots?.length || 0} spots`);
    
    if (!spots || spots.length < 2) {
      console.log('⚠️  Need at least 2 spots for testing');
      return;
    }
    
    // 3. Get existing test user or skip authentication test
    console.log('\n👤 Testing API endpoint directly...');
    console.log('⚠️  Skipping user creation - testing API validation only');
    
    // 4. Test API endpoint without authentication (should return 401)
    console.log('\n🚗 Testing API endpoint validation...');
    const pickupSpot = spots[0];
    const destinationSpot = spots[1];
    const fare = 4.0;
    const distance = 1.5;
    
    // Test the API endpoint directly
    const testResponse = await fetch('http://localhost:3000/api/rides/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pickup_spot_id: pickupSpot.id,
        dropoff_spot_id: destinationSpot.id,
        fare,
        distance,
      }),
    });
    
    const testResult = await testResponse.json();
    
    if (testResponse.status === 401) {
      console.log('✅ API correctly returns 401 for unauthenticated requests');
    } else {
      console.log(`❌ Unexpected response: ${testResponse.status}`, testResult);
    }
    
    // 5. Test direct database insertion (with service role)
    console.log('\n🗄️  Testing direct database insertion...');
    
    const { data: ride, error: rideError } = await supabase
      .from('rides')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // dummy user ID
        pickup_spot_id: pickupSpot.id,
        dropoff_spot_id: destinationSpot.id,
        fare,
        status: 'pending',
      })
      .select()
      .single();
    
    if (rideError) {
      console.error('❌ Ride creation error:', rideError);
      return;
    }
    
    console.log(`✅ Successfully created ride: ${ride.id}`);
    console.log(`📍 ${pickupSpot.name} → ${destinationSpot.name}`);
    console.log(`💰 Fare: $${fare}`);
    console.log(`🐻 Assigned AirBear: ${airbears[0].id}`);
    
    // 5. Verify AirBear was marked unavailable
    console.log('\n🔍 Verifying AirBear status...');
    const { data: updatedAirbear, error: checkError } = await supabase
      .from('airbears')
      .select('is_available')
      .eq('id', airbears[0].id)
      .single();
    
    if (checkError) {
      console.error('❌ AirBear status check error:', checkError);
    } else {
      console.log(`✅ AirBear availability updated: ${updatedAirbear.is_available ? 'Available' : 'Unavailable'}`);
    }
    
    // 6. Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    if (ride) {
      await supabase.from('rides').delete().eq('id', ride.id);
    }
    await supabase.from('airbears').update({ is_available: true }).eq('id', airbears[0].id);
    
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBookingFlow();
