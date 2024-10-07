CREATE TRIGGER "InvokeCheckSearchPriceDropOnUpdatedSearch" AFTER UPDATE ON public.searches FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://lyokztgvzshwkrselysa.supabase.co/functions/v1/check-search-price-drops', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5b2t6dGd2enNod2tyc2VseXNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzkxNjcyMSwiZXhwIjoyMDQzNDkyNzIxfQ.cf9LXv6kpvW2Crmoy3sLWnOT90f5_guZSdqS97XbCnY"}', '{}', '1000');


