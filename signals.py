import os
from django.dispatch import receiver
from django.db.models.signals import post_delete
from gallery.models import Image


# Delete image files from disk when image objects are deleted
@receiver(post_delete, sender=Image)
def on_delete(sender, **kwargs):
    img = kwargs['instance']

    # First delete cache files. The cache directory holding the photo variants is:
    cache_dir = os.path.commonpath((img.data_preview.path, img.data_thumbnail.path))
    for d in (img.data_preview, img.data_thumbnail):
        if d.storage.exists(d.path): d.storage.delete(d.path)  # Delete each variant
    if os.path.exists(cache_dir):
        os.rmdir(cache_dir)  # should this fail, throw exception, something's amiss.
    # Now delete the 'original'
    img.data.delete(save=False)
