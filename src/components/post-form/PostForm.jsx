import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import appwriteService from '../../appwrite/config';

function PostForm({post}) {
    //watch-> any field that requires continuous monitoring
    const {register, handleSubmit, watch, setValue, control, getValues}= useForm({defaultValues:{
        title:post ?.title || '',
        slug : post ?.slug || '',
        content:post ?. content || '',
        status : post ?.status || 'active'
    }})
    const navigate= useNavigate()
    const userData = useSelector(state => state.user.userData);

    //on post-form submission 
    const submit = async (data)=>{
        //update post if post available
        if(post){
            const file= data.image[0] ? appwriteService.uploadFile(data.image[0]) : null;
            //deleting previous image
            if(file){
                appwriteService.deleteFile(post.featuredImage);
            }
            //update post 
            const dbPost = await appwriteService.updatePost(post.$id,{
                ...data,
                featuredImage : file ? file.$id : undefined
            })
            //navigating user
            if(dbPost){
                navigate(`/post/ ${dbPost.$id}`);
            }
        }
        //creating new post
        else{
            //upload image
            const file = await appwriteService.uploadFile(data.image[0])

            if(file){
                const fileId= file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({
                    ...data, 
                    userId: userData.$id
                })
                //navigating user
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`);
                }
                
            }
        }
    }
    //creating slug
    const slugTransform = useCallback((value)=>{
        if(value && typeof value==='string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/^[a-zA-Z/d/s]+/g, '-')
            .replace(/\s/g, '-')
        }
        return "";
    },[]);

    React.useEffect(()=>{
        const subscription = watch((value, {name})=>{
            if(name === 'title'){
                setValue('slug',slugTransform(value.title,{shouldValidate:true}))
            }
        })
    })
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
    <div className="w-2/3 px-2">
        <Input
            label="Title :"
            placeholder="Title"
            className="mb-4"
            {...register("title", { required: true })}
        />
        <Input
            label="Slug :"
            placeholder="Slug"
            className="mb-4"
            {...register("slug", { required: true })}
            onInput={(e) => {
                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
            }}
        />
        <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
    </div>
    <div className="w-1/3 px-2">
        <Input
            label="Featured Image :"
            type="file"
            className="mb-4"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("image", { required: !post })}
        />
        {post && (
            <div className="w-full mb-4">
                <img
                    src={appwriteService.getFilePreview(post.featuredImage)}
                    alt={post.title}
                    className="rounded-lg"
                />
            </div>
        )}
        <Select
            options={["active", "inactive"]}
            label="Status"
            className="mb-4"
            {...register("status", { required: true })}
        />
        <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
            {post ? "Update" : "Submit"}
        </Button>
    </div>
</form>
  )
}

export default PostForm;